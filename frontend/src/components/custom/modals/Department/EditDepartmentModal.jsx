import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useDepartmentMutations } from "../../../../hooks/queries/department/useDepartmentMutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const EditDepartmentModal = ({ open, onOpenChange, department }) => {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      department_code: "",
    },
  });
  const { updateDepartment } = useDepartmentMutations();
  const isSubmitting = updateDepartment.isPending;

  useEffect(() => {
    if (!open) {
      form.reset();
    }
    if (department) {
      form.reset({
        name: department.name || "",
        description: department.description || "",
        department_code: department.department_code || "",
      });
    }
  }, [open, department, form]);

  const onSubmit = async (formData) => {
    if (isSubmitting) {
      return;
    }
    try {
      await updateDepartment.mutateAsync({
        id: department.id,
        department: formData,
      });

      toast.success("Department updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update department."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[40rem]">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Department</DialogTitle>
          <DialogDescription>
            Modify the department information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2">
            {/* Department Name */}
            <Controller
              control={form.control}
              name="name"
              rules={{ required: "Department name is required" }}
              render={({ field, fieldState: { error } }) => (
                <Field>
                  <FieldLabel>Department Name</FieldLabel>
                  <Input {...field} placeholder="The name of the department" />
                  {error && <FieldError>{error.message}</FieldError>}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              control={form.control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field, fieldState: { error } }) => (
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    rows={3}
                    {...field}
                    placeholder="Brief description of the department's responsibilities"
                  />
                  {error && <FieldError>{error.message}</FieldError>}
                </Field>
              )}
            />

            {/* Department Code */}
            <Controller
              control={form.control}
              name="department_code"
              rules={{ required: "Code is required" }}
              render={({ field, fieldState: { error } }) => (
                <Field>
                  <FieldLabel>Department Code</FieldLabel>
                  <Input maxLength={10} {...field} placeholder="e.g. ICT, HR" />
                  {error && <FieldError>{error.message}</FieldError>}
                </Field>
              )}
            />
          </div>

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

export default EditDepartmentModal;
