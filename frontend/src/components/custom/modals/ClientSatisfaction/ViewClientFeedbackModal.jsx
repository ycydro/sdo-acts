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

import { Badge } from "@/components/ui/badge";
import StarRating from "../../StarRating";

const ViewClientFeedbackModal = ({ feedback, open, onOpenChange }) => {
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
          <DialogDescription>
            Full details of the customer review
          </DialogDescription>
        </DialogHeader>

        {feedback && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{feedback.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {feedback.departmentFull}
                </p>
              </div>
              <Badge variant="outline">{feedback.service}</Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Summary</h4>
              <p className="text-sm text-muted-foreground">
                {feedback.comment}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Full Review</h4>
              <p className="text-sm">{feedback.fullComment}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="font-bold">{feedback.rating}</span>
                <StarRating value={feedback.rating} />
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewClientFeedbackModal;
