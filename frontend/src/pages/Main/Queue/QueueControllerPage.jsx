import { useState, useMemo, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Clock,
  Plus,
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { useTicketMutations } from "@/hooks/queries/ticket/useTicketMutations";
import { useQueuedTicketsByDepartment } from "@/hooks/queries/ticket/queue/useQueuedTicketsByDepartment";
import { useSocket } from "@/context/SocketContext";
import { toast } from "sonner";
import ConfirmationModal from "@/components/custom/modals/ConfirmationModal";

export const QueueControllerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, isConnected, joinDepartment, leaveDepartment } = useSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const departmentId = user?.department_id;

  const {
    data: queueTickets = [],
    isLoading: isLoadingQueue,
    refetch: refetchQueue,
  } = useQueuedTicketsByDepartment(departmentId);

  const { updateTicketStatus } = useTicketMutations();

  // Join department room on mount
  useEffect(() => {
    if (departmentId && socket) {
      joinDepartment(departmentId);
    }

    return () => {
      if (departmentId) {
        leaveDepartment(departmentId);
      }
    };
  }, [departmentId, socket]);

  // LISTEN for queue updates
  useEffect(() => {
    if (!socket) return;

    const handleQueueUpdate = (data) => {
      console.log("Queue update received:", data);

      // only refetch if it's for our department
      if (data.departmentId === departmentId) {
        refetchQueue();
      }
    };

    socket.on("queue-updated", handleQueueUpdate);

    return () => {
      socket.off("queue-updated", handleQueueUpdate);
    };
  }, [socket, departmentId, refetchQueue]);

  // CURRENT ticket is the FIRST ticket in the queue
  const currentTicket = queueTickets.length > 0 ? queueTickets[0] : null;

  // Remaining tickets (di kasama first one since siya current ticket)
  const remainingTickets = queueTickets.slice(1);

  // Filtered tickets based on search (only for the remaining queue)
  const filteredTickets = useMemo(() => {
    if (!searchTerm.trim()) return remainingTickets;

    const searchLower = searchTerm.toLowerCase();
    return remainingTickets.filter(
      (ticket) =>
        ticket.ticket_code?.toLowerCase().includes(searchLower) ||
        `${ticket.client?.first_name} ${ticket.client?.last_name}`
          .toLowerCase()
          .includes(searchLower),
    );
  }, [remainingTickets, searchTerm]);

  const handleStatusChange = async (ticket, newStatus) => {
    try {
      await updateTicketStatus.mutateAsync({
        id: ticket.id,
        status: newStatus,
      });

      let message = "";
      switch (newStatus) {
        case "Resolved":
          message = "Ticket resolved! Next person in queue can now be called.";
          break;
        case "Ongoing":
          message =
            "Ticket approved and set to Ongoing! Next person in queue can now be called.";
          break;
        case "Declined":
          message = "Ticket declined! Next person in queue can now be called.";
          break;
        default:
          message = "Ticket status updated!";
      }

      toast.success(message);
    } catch (error) {
      console.error(`Error updating ticket to ${newStatus}:`, error);
      toast.error(`Error updating ticket. Please try again.`);
    } finally {
      setIsConfirmModalOpen(false);
      setPendingAction(null);
      setSelectedTicket(null);
    }
  };

  const handleResolveImmediately = () => {
    if (!currentTicket) return;
    setSelectedTicket(currentTicket);
    setPendingAction(() => () => handleStatusChange(currentTicket, "Resolved"));
    setIsConfirmModalOpen(true);
  };

  const handleApprove = () => {
    if (!currentTicket) return;
    setSelectedTicket(currentTicket);
    setPendingAction(() => () => handleStatusChange(currentTicket, "Ongoing"));
    setIsConfirmModalOpen(true);
  };

  const handleDecline = () => {
    if (!currentTicket) return;
    setSelectedTicket(currentTicket);
    setPendingAction(() => () => handleStatusChange(currentTicket, "Declined"));
    setIsConfirmModalOpen(true);
  };

  const handleRefresh = () => {
    refetchQueue();
  };

  const handlePreview = (ticket) => {
    navigate(`/main/tickets/view/${ticket?.id}`);
  };

  const getModalTitle = (ticket) => {
    if (!ticket) return "";

    if (pendingAction) {
      const action = pendingAction.toString();
      if (action.includes("Resolved")) return "Resolve Ticket Immediately?";
      if (action.includes("Ongoing")) return "Approve This Ticket?";
      if (action.includes("Declined")) return "Decline This Ticket?";
    }
    return "Confirm Action";
  };

  const getModalDescription = (ticket) => {
    if (!ticket) return "";

    if (pendingAction) {
      const action = pendingAction.toString();
      if (action.includes("Resolved"))
        return `Ticket ${ticket.ticket_code} will be marked as 'Resolved' and removed from the queue.`;
      if (action.includes("Ongoing"))
        return `Ticket ${ticket.ticket_code} will be set to 'Ongoing' status and removed from the queue.`;
      if (action.includes("Declined"))
        return `Ticket ${ticket.ticket_code} will be marked as 'Declined' and removed from the queue.`;
    }
    return "Are you sure you want to proceed with this action?";
  };

  const getModalDestructiveStatus = (ticket) => {
    if (!ticket) return false;

    if (pendingAction) {
      const action = pendingAction.toString();
      // Mark decline as destructive action
      return action.includes("Declined");
    }
    return false;
  };

  return (
    <>
      <main className="min-w-full h-full">
        {/* MAIN AREA */}
        <div className="grid grid-cols-4 gap-6 h-full">
          <Card className="col-span-3 border shadow-lg py-4 justify-center">
            <CardHeader className="text-center border-b pb-4">
              <div className="mb-4 flex items-center justify-center gap-2">
                {isConnected ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Wifi className="w-4 h-4" />
                    <span>Live Updates Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <WifiOff className="w-4 h-4" />
                    <span>Reconnecting...</span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold">Currently Serving</h2>
            </CardHeader>

            <CardContent>
              {isLoadingQueue ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Loading queue...</p>
                  </div>
                </div>
              ) : currentTicket ? (
                <>
                  {/* TICKET NUMBER DISPLAY */}
                  <div className="flex flex-col items-center justify-center py-9">
                    <p className="text-8xl font-bold text-green-700 leading-none">
                      {currentTicket.ticket_code || "---"}
                    </p>
                    <p className="text-lg text-muted-foreground">
                      Ticket {currentTicket.ticket_code}
                    </p>
                  </div>

                  <Separator className="my-4" />

                  {/* USER DETAILS */}
                  <div className="flex justify-between gap-6 px-2 py-4">
                    <div className="space-y-2 flex-1">
                      <label className="flex items-center gap-2 text-sm font-semibold">
                        <User className="w-4 h-4" /> Customer Name
                      </label>
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="font-medium">
                          {currentTicket.client?.first_name}{" "}
                          {currentTicket.client?.last_name}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 flex-1">
                      <label className="flex items-center gap-2 text-sm font-semibold">
                        <Plus className="w-4 h-4" /> Service Type
                      </label>
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <p className="font-medium">
                          {currentTicket.service?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full px-2">
                    <label className="text-sm font-semibold mb-2 block">
                      Ticket Details
                    </label>
                    <div className="bg-white border rounded-md p-3 text-md text-gray-700 leading-relaxed min-h-[80px] shadow-sm">
                      {currentTicket.details || "No details provided"}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex justify-center gap-4 pt-6">
                    <Button
                      onClick={handleResolveImmediately}
                      disabled={updateTicketStatus.isPending}
                      className="bg-primary text-white px-8 py-6 text-lg rounded-xl flex-1"
                    >
                      <CheckCircle className="mr-3 w-5 h-5" />
                      Resolve
                    </Button>
                    <Button
                      onClick={handleApprove}
                      disabled={updateTicketStatus.isPending}
                      variant="outline"
                      className="bg-blue-500/10 border-blue-500 text-blue-700 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-800 px-8 py-6 text-lg rounded-xl flex-1"
                    >
                      <CheckCircle className="mr-3 w-5 h-5" />
                      Set to Ongoing
                    </Button>

                    <Button
                      onClick={handleDecline}
                      disabled={updateTicketStatus.isPending}
                      variant="outline"
                      className="border-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 px-8 py-6 text-lg rounded-xl flex-1"
                    >
                      <XCircle className="mr-3 w-5 h-5" />
                      Decline
                    </Button>

                    <Button
                      onClick={() => handlePreview(currentTicket)}
                      disabled={updateTicketStatus.isPending}
                      variant="outline"
                      className="border-2 px-8 py-6 text-lg rounded-xl flex-1"
                    >
                      <Eye className="mr-3 w-5 h-5" />
                      View Details
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    No Tickets in Queue
                  </h3>
                  <p className="text-gray-500">
                    No tickets scheduled for discussion today
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* NEXT QUEUE LIST */}
          <Card className="col-span-1 border shadow-lg justify-center">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Next in Queue</h2>
                  <p className="text-sm text-muted-foreground">
                    {remainingTickets.length} ticket
                    {remainingTickets.length !== 1 ? "s" : ""} waiting
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoadingQueue}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoadingQueue ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col justify-center py-3">
              {/* SEARCH */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* QUEUE ITEMS LIST */}
              <div className="flex-1 overflow-y-auto pr-3 space-y-3 max-h-[500px]">
                {isLoadingQueue ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Loading queue...</p>
                  </div>
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <NextQueueItem
                      key={ticket.id}
                      ticket={ticket}
                      onPreview={handlePreview}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? "No tickets match your search"
                      : "No more tickets in queue"}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total in Queue:</span>
                  <span className="font-semibold">
                    {queueTickets.length || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ConfirmationModal
        open={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        onConfirm={pendingAction}
        title={getModalTitle(selectedTicket)}
        description={getModalDescription(selectedTicket)}
        confirmText="Confirm"
        cancelText="Cancel"
        isDestructive={
          selectedTicket && getModalDestructiveStatus(selectedTicket)
        }
        isLoading={updateTicketStatus.isPending}
      />
    </>
  );
};

const NextQueueItem = ({ ticket, onPreview }) => {
  return (
    <div className="p-3 border border-gray-500 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-primary text-lg py-0.5 rounded">
              {ticket.ticket_code}
            </span>
          </div>
          <p className="font-medium text-base">
            {ticket.client?.first_name} {ticket.client?.last_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {ticket.service?.name}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(ticket.scheduled_date, {
                addSuffix: true,
              }) || "N/A"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-auto px-0.5 hover:text-primary"
          onClick={() => onPreview(ticket)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default QueueControllerPage;
