import React, { useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Users, Ticket, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useActiveTicket } from "@/hooks/queries/ticket/useActiveTicket";
import { useClientQueue } from "@/hooks/queries/ticket/queue/useClientQueue";
import { useSocket } from "@/context/SocketContext";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { format } from "date-fns";

export const ClientQueuePage = () => {
  const navigate = useNavigate();
  const { socket, joinDepartment, leaveDepartment } = useSocket();

  const {
    data: activeTicket,
    isLoading: isLoadingTicket,
    refetch: refetchTicket,
  } = useActiveTicket();

  const {
    data: queueData,
    isLoading: isLoadingQueue,
    refetch: refetchQueue,
  } = useClientQueue(activeTicket?.id);

  const departmentId = activeTicket?.service?.department?.id;
  const scheduledDate = activeTicket?.scheduled_date;

  const formattedDate = scheduledDate
    ? format(new Date(scheduledDate), "MMMM d, yyyy")
    : null;

  // Join department room for real-time updates
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

  // Listen for queue updates
  useEffect(() => {
    if (!socket) return;

    const handleQueueUpdate = (data) => {
      console.log("Queue update received:", data);
      // Check both departmentID and departmentId for compatibility
      if (
        data.departmentId === departmentId ||
        data.departmentID === departmentId
      ) {
        console.log("Refetching queue for department:", departmentId);
        refetchQueue();
        refetchTicket();
      }
    };

    const handleQueueStateUpdate = (data) => {
      console.log("Queue state update received:", data);
      if (data.departmentId === departmentId) {
        console.log("Refetching queue due to state change");
        refetchQueue();
        refetchTicket();
      }
    };

    socket.on("queue-updated", handleQueueUpdate);
    socket.on("queue-state-updated", handleQueueStateUpdate);

    return () => {
      socket.off("queue-updated", handleQueueUpdate);
      socket.off("queue-state-updated", handleQueueStateUpdate);
    };
  }, [socket, departmentId, refetchQueue, refetchTicket]);

  const handleRefresh = () => {
    refetchQueue();
    refetchTicket();
  };

  const isLoading = isLoadingTicket || isLoadingQueue;
  const queue = queueData?.data?.queue || [];
  const userPosition = queueData?.data?.userPosition || 0;
  const totalInQueue = queueData?.data?.totalInQueue || 0;

  if (
    (!activeTicket && !isLoadingTicket) ||
    activeTicket?.status !== "In Queue"
  ) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <Ticket className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No Approved Ticket
            </h3>
            <p className="text-gray-500 text-center mb-6">
              You don't have an approved ticket request to view the queue
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-3 sm:py-5">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-3 sm:mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Queue Status {formattedDate && `for ${formattedDate}`}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-9 w-9 p-0 sm:h-10 sm:w-auto sm:px-3"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Your Ticket Info Card */}
      <Card className="mb-4 sm:mb-6 shadow-lg border-2 border-primary">
        <CardHeader className="bg-primary/5 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase mb-1">
                Your Ticket
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-primary">
                {activeTicket?.ticket_code}
              </h2>
            </div>
            <Badge
              variant="secondary"
              className="bg-primary text-white text-xs sm:text-sm px-2 sm:px-3 py-1"
            >
              {activeTicket?.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-600 mb-1">Your Position</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {isLoading ? "..." : userPosition}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-600 mb-1">Total in Queue</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-700">
                {isLoading ? "..." : totalInQueue}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue List */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ticket className="w-6 h-6 text-primary" />
              <h3 className="text-xl sm:text-2xl font-bold">Queue Order</h3>
            </div>
            <Badge variant="outline" className="text-sm sm:text-base px-3 py-1">
              {totalInQueue} ticket{totalInQueue !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-2.5 sm:px-6 sm:py-5">
          {isLoading ? (
            <div className="text-center py-12 sm:py-16">
              <RefreshCw className="w-10 h-10 sm:w-12 sm:h-12 animate-spin mx-auto mb-3 text-gray-400" />
              <p className="text-base text-gray-500">Loading queue...</p>
            </div>
          ) : queue.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="bg-gray-100 rounded-full p-4 sm:p-5 w-fit mx-auto mb-4">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <p className="text-lg text-gray-600">No tickets in queue</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-4 max-h-[600px] sm:max-h-[750px] overflow-y-auto px-2">
              {queue.map((ticket, index) => (
                <QueueListCard key={ticket.id} ticket={ticket} index={index} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

const QueueListCard = ({ ticket, index }) => {
  return (
    <div
      key={ticket.id}
      className={clsx(
        "flex items-center gap-3 sm:gap-4 p-1.5 sm:p-3 rounded-lg border-2 transition-all",
        ticket.is_current_user
          ? "bg-primary/10 border-primary shadow-md"
          : "bg-white border-gray-200 hover:border-gray-300",
      )}
    >
      <div
        className={clsx(
          "flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base",
          ticket.is_current_user
            ? "bg-primary text-white"
            : "bg-gray-200 text-gray-700",
        )}
      >
        {index + 1}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            "font-mono font-bold text-base sm:text-lg truncate",
            ticket.is_current_user ? "text-primary" : "text-gray-900",
          )}
        >
          {ticket.ticket_code}
        </p>
        {ticket.is_current_user && (
          <p className="text-xs sm:text-sm text-primary font-semibold">
            Your ticket
          </p>
        )}
      </div>

      {ticket.is_current_user && (
        <Badge className="bg-primary text-white text-xs sm:text-sm flex-shrink-0">
          You
        </Badge>
      )}
    </div>
  );
};

export default ClientQueuePage;
