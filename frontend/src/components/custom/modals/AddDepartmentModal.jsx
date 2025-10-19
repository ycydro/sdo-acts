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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { useDepartmentMutations } from "../../../hooks/queries/useDepartmentMutations";

const AddDepartmentModal = ({ open, onOpenChange }) => {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { createDepartment } = useDepartmentMutations();

  const onSubmit = async (data) => {
    console.log("Submitted:", data);
    try {
      await createDepartment.mutateAsync(data);
      alert("Department created successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create department.");
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[40rem]">
        <DialogHeader>
          <DialogTitle className="text-lg">Add New Department</DialogTitle>
          <DialogDescription>
            Create a new department for your SDO-Meycauayan. Fill in all the
            required information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-5 py-2">
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
                        placeholder="The name of the new department"
                        {...field}
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
                        placeholder="Brief description of the department's responsibilities"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Department</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartmentModal;
