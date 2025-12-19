import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Clock,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  Play,
} from "lucide-react";
import { useTicketMutations } from "@/hooks/queries/ticket/useTicketMutations";

const ChangeTicketStatusModal = ({ ticket, open, onOpenChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      department_code: "",
    },
  });

  const handleClose = () => {
    onOpenChange(false);
    setSelectedStatus(null);
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const { updateTicketStatus } = useTicketMutations();

  const handleStatusChange = async (id, status) => {
    const ticketData = {
      id,
      status,
    };
    try {
      await updateTicketStatus.mutateAsync(ticketData);
      toast.success("Ticket changed status successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update ticket.");
    }
  };

  // Check if ticket is unstarted (In Queue)
  const isUnstartedTicket = ticket?.status === "In Queue";

  // All possible status options
  const allStatusOptions = [
    {
      value: "Ongoing",
      label: isUnstartedTicket ? "Start this Ticket" : "Ongoing",
      icon: isUnstartedTicket ? (
        <Play className="h-5 w-5" fill="currentColor" />
      ) : (
        <Clock className="h-5 w-5" />
      ),
      description: isUnstartedTicket
        ? "Begin working on this ticket"
        : "Actively in progress",
      color:
        "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
      hoverColor: "hover:bg-blue-500/20 hover:border-blue-500/50",
      isStartAction: isUnstartedTicket,
    },
    {
      label: "On hold",
      value: "On hold",
      icon: <AlertCircle className="h-5 w-5" />,
      description: "Paused temporarily",
      color:
        "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400",
      hoverColor: "hover:bg-orange-500/20 hover:border-orange-500/50",
      isStartAction: false,
    },
    {
      value: "Resolved",
      label: "Resolve",
      icon: <CheckCircle2 className="h-5 w-5" />,
      description: "Completed successfully",
      color:
        "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
      hoverColor: "hover:bg-green-500/20 hover:border-green-500/50",
      isStartAction: false,
    },
    {
      value: "Declined",
      label: "Decline",
      icon: <AlertCircle className="h-5 w-5" />,
      description: "Decline service",
      color: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400",
      hoverColor: "hover:bg-red-500/20 hover:border-red-500/50",
      isStartAction: false,
    },
  ];

  // dont show current status on the options
  const statusOptions = allStatusOptions.filter(
    (option) => option.value !== ticket?.status
  );

  // for unstarted tickets, show ongoing and decline options else dont show declined
  const finalStatusOptions = isUnstartedTicket
    ? statusOptions.filter(
        (option) => option.value === "Ongoing" || option.value === "Declined"
      )
    : statusOptions.filter((option) => option.value !== "Declined");

  const selectedOption = finalStatusOptions.find(
    (option) => option.value === selectedStatus
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isUnstartedTicket
              ? `Start Ticket ${ticket?.ticket_code}`
              : `Change Status of ${ticket?.ticket_code}`}
          </DialogTitle>
          <DialogDescription>
            {isUnstartedTicket
              ? "Begin working on this ticket by starting it"
              : "Select a new status for this ticket"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {finalStatusOptions.length > 0 ? (
            finalStatusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedStatus === option.value
                    ? `${option.color} border-2 ring-2 ring-offset-2 ring-offset-background`
                    : `border-border bg-background hover:bg-secondary/30 ${option.hoverColor}`
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 ${
                      selectedStatus === option.value
                        ? option.color
                            .split(" ")
                            .find((c) => c.startsWith("text"))
                        : "text-muted-foreground"
                    }`}
                  >
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {option.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                  {selectedStatus === option.value && (
                    <div className="h-5 w-5 rounded-full border-2 border-current bg-current/20 mt-1" />
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              No other status options available for this ticket.
            </div>
          )}
        </div>

        <DialogFooter className="mt-5 gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (selectedStatus) {
                await handleStatusChange(ticket?.id, selectedStatus);
                handleClose();
              }
            }}
            disabled={!selectedStatus}
            className={`flex-1 gap-2 ${
              selectedOption?.isStartAction
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-primary"
            }`}
          >
            {selectedOption?.isStartAction ? (
              <>
                <PlayCircle className="h-4 w-4" />
                Start Ticket
              </>
            ) : (
              "Confirm Change"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeTicketStatusModal;
