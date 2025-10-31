import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDepartmentMutations } from "../../../hooks/queries/useDepartmentMutations";
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const EditDepartmentModal = ({ open, onOpenChange, department }) => {
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
    if (department) {
      form.reset({
        name: department.name || "",
        description: department.description || "",
        department_code: department.department_code || "",
      });
    }
  }, [open, department, form]);

  const { updateDepartment } = useDepartmentMutations();

  const onSubmit = async (formData) => {
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-2">
              {/* Department Name */}
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Department name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="The name of the department"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        {...field}
                        placeholder="Brief description of the department's responsibilities"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department Code */}
              <FormField
                control={form.control}
                name="department_code"
                rules={{ required: "Code is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Code</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={10}
                        {...field}
                        placeholder="e.g. ICT, HR"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentModal;
