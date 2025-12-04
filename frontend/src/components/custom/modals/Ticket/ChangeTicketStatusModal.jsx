import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
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

  const handleStatusChange = async (ticketID, status) => {
    const ticketData = {
      ticketID,
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

  const statusOptions =
    ticket?.status === "New"
      ? [
          {
            value: "Ongoing",
            label: "Ongoing",
            icon: <Clock className="h-5 w-5" />,
            description: "Actively in progress",
            color:
              "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
            hoverColor: "hover:bg-blue-500/20 hover:border-blue-500/50",
          },
        ]
      : [
          {
            value: "On-hold",
            label: "On-hold",
            icon: <AlertCircle className="h-5 w-5" />,
            description: "Paused temporarily",
            color:
              "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400",
            hoverColor: "hover:bg-orange-500/20 hover:border-orange-500/50",
          },
          {
            value: "Resolved",
            label: "Resolve",
            icon: <CheckCircle2 className="h-5 w-5" />,
            description: "Completed successfully",
            color:
              "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
            hoverColor: "hover:bg-green-500/20 hover:border-green-500/50",
          },
          {
            value: "Declined",
            label: "Decline",
            icon: <AlertCircle className="h-5 w-5" />,
            description: "Decline service",
            color:
              "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400",
            hoverColor: "hover:bg-red-500/20 hover:border-red-500/50",
          },
        ];

  useEffect(() => {
    if (ticket?.status === "Ongoing") {
    }
  }, [ticket?.status]);
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Change Status of {ticket?.ticket_code}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {statusOptions.map((option) => (
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
                  <p className="font-medium text-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
                {selectedStatus === option.value && (
                  <div className="h-5 w-5 rounded-full border-2 border-current bg-current/20 mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>

        <DialogFooter className="mt-5">
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
            className="flex-1 bg-primary"
          >
            Confirm Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeTicketStatusModal;
