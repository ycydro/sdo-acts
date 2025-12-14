import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema } from "../../../../validations/serviceSchema";
import { useForm, Controller } from "react-hook-form";
import {
  convertToMinutes,
  convertMinutesToTimeParts,
} from "../../../../lib/timeUtils";
import { useDepartments } from "../../../../hooks/queries/department/useDepartments";
import { useServiceMutations } from "../../../../hooks/queries/service/useServiceMutations";
import { priorityColors } from "@/lib/constants/priorityColors";

const EditServiceModal = ({ open, onOpenChange, service }) => {
  const { data: departments, isLoading: isDepartmentsLoading } =
    useDepartments();

  const { updateService } = useServiceMutations();
  const isSubmitting = updateService.isPending;

  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      classification: "",
      priority: "",
      department_id: "",
      time_days: 0,
      time_hours: 0,
      time_minutes: 0,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }

    if (service) {
      const { days, hours, minutes } = convertMinutesToTimeParts(
        service.processing_time_in_minutes
      );

      form.reset({
        name: service.name || "",
        description: service.description || "",
        classification: service.classification || "",
        priority: service.priority || "",
        department_id: service.department_id || "",
        time_days: days,
        time_hours: hours,
        time_minutes: minutes,
      });
    }
  }, [open, service, form]);

  const onSubmit = async (data) => {
    if (isSubmitting) {
      return;
    }

    try {
      const totalMinutes = convertToMinutes(
        data.time_days,
        data.time_hours,
        data.time_minutes
      );

      const submitData = {
        ...data,
        processing_time_in_minutes: totalMinutes,
      };

      delete submitData.time_days;
      delete submitData.time_hours;
      delete submitData.time_minutes;

      await updateService.mutateAsync({
        id: service.id,
        service: submitData,
      });

      toast.success("Service updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update service.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[40rem]">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Service</DialogTitle>
          <DialogDescription>
            Modify the service information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Service name */}
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <Field>
                  <FieldLabel>Service Name</FieldLabel>
                  <Input placeholder="The name of the service" {...field} />
                  {error && <FieldError>{error.message}</FieldError>}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState: { error } }) => (
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    placeholder="Brief description of the service"
                    rows={3}
                    {...field}
                  />
                  {error && <FieldError>{error.message}</FieldError>}
                </Field>
              )}
            />

            {/* Department */}
            <Controller
              control={form.control}
              name="department_id"
              render={({ field, fieldState: { error } }) => (
                <Field className="space-y-1 w-full flex-2">
                  <FieldLabel>Department</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select what department will offer this service" />
                    </SelectTrigger>
                    <SelectContent>
                      {isDepartmentsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading departments...
                        </SelectItem>
                      ) : departments?.data ? (
                        departments.data.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="error" disabled>
                          No departments available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {error && <FieldError>{error.message}</FieldError>}
                </Field>
              )}
            />

            <div className="flex gap-3">
              {/* Classification */}
              <Controller
                control={form.control}
                name="classification"
                render={({ field, fieldState: { error } }) => (
                  <Field className="space-y-1 w-full flex-1">
                    <FieldLabel>Classification</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select classification type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Simple">Simple</SelectItem>
                        <SelectItem value="Complex">Complex</SelectItem>
                      </SelectContent>
                    </Select>
                    {error && <FieldError>{error.message}</FieldError>}
                  </Field>
                )}
              />

              {/* Priority */}
              <Controller
                control={form.control}
                name="priority"
                render={({ field, fieldState: { error } }) => (
                  <Field className="space-y-1 w-full flex-1">
                    <FieldLabel>Priority</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`min-w-full border-2 ${
                          priorityColors[field.value] || ""
                        }`}
                      >
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    {error && <FieldError>{error.message}</FieldError>}
                  </Field>
                )}
              />
            </div>

            {/* Processing Time */}
            <Field>
              <FieldLabel>Total Processing Time</FieldLabel>
              <FieldDescription className="m-0 p-0">
                Estimated average time to complete this service
              </FieldDescription>
              <div className="grid grid-cols-3 gap-3 mt-1 px-0.5">
                <Controller
                  control={form.control}
                  name="time_days"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel className="text-sm">Days</FieldLabel>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="time_hours"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel className="text-sm">Hours</FieldLabel>
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        placeholder="0"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="time_minutes"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel className="text-sm">Minutes</FieldLabel>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </Field>
                  )}
                />
              </div>
              {form.formState.errors.processing_time && (
                <FieldError>
                  {form.formState.errors.processing_time.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceModal;
