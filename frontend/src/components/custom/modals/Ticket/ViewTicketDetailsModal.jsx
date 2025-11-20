import { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";

const ViewTicketDetailsModal = ({ ticket, open, onOpenChange }) => {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      department_code: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-6xl">
        {/* Ticket Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Ticket Code
            </p>
            <p className="text-lg font-semibold text-foreground">
              {ticket?.ticket_code || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Status
            </p>
            {ticket?.status || "N/A"}
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Client Name
            </p>
            <p className="text-foreground text-lg">
              {`${ticket?.client?.first_name} ${ticket?.client?.last_name}` ||
                "No client"}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Assignee
            </p>
            <p className="text-foreground text-lg">
              {ticket?.assignee?.first_name || "Unassigned"}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Service Name
            </p>
            <p className="text-foreground text-lg">
              {ticket?.service?.name || "No service"}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Department
            </p>
            <p className="text-foreground text-lg">
              {ticket?.service?.department?.name || "No department"}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Details
          </p>
          <div className="bg-muted p-4 rounded-lg border border-border">
            <p className="text-foreground text-lg leading-relaxed">
              {ticket?.details || "No details provided"}
            </p>
          </div>
        </div>

        <DialogFooter className="mt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTicketDetailsModal;
