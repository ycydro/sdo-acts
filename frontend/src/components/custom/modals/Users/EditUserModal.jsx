import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useUserMutations } from "@/hooks/queries/users/useUserMutations";
import { useRoles } from "@/hooks/queries/role/useRoles";
import { useDepartments } from "@/hooks/queries/department/useDepartments";
import {
  Eye,
  EyeClosed,
  User,
  Users,
  Clipboard,
  Mail,
  Phone,
  ShieldCheck,
  Building,
} from "lucide-react";

const EditUserModal = ({ open, onOpenChange, selectedUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: "",
      role_id: "",
      department_id: "",
      email: "",
      phone_no: "",
    },
  });

  const { updateUser } = useUserMutations();
  const isSubmitting = updateUser.isPending;

  useEffect(() => {
    if (!open) {
      form.reset();
      setShowPassword(false);
      setSelectedRoleName("");
    }
    if (selectedUser) {
      console.log(selectedUser, "user in edit");
      form.reset({
        first_name: selectedUser.first_name || "",
        last_name: selectedUser.last_name || "",
        gender: selectedUser.sex || "other",
        role_id: selectedUser.role?.id || "",
        department_id: selectedUser.department?.id || "",
        email: selectedUser.email || "",
        phone_no: selectedUser.mobile_number || "",
      });
    }
  }, [open, selectedUser, form]);

  const { data: roles, isLoading: isRolesLoading } = useRoles();
  const { data: departments, isLoading: isDepartmentsLoading } =
    useDepartments();

  useEffect(() => {
    if (selectedUser?.role?.id && roles?.data) {
      const role = roles.data.find((r) => r.id === selectedUser.role.id);
      setSelectedRoleName(role?.name || "");

      // Set department_id in form if user is staff
      if (role?.name.toLowerCase() === "staff" && selectedUser.department?.id) {
        form.setValue("department_id", selectedUser.department.id);
      } else {
        form.setValue("department_id", "");
      }
    } else {
      setSelectedRoleName("");
    }
  }, [selectedUser?.role?.id, roles, form, selectedUser?.department?.id]);

  // Check if the selected role is "Staff"
  const isStaffRole = selectedRoleName.toLowerCase() === "staff";

  const onSubmit = async (formData) => {
    if (isSubmitting) {
      return;
    }

    console.log(formData, "submitting this data");
    console.log(selectedUser.id, "submitting this id");

    try {
      await updateUser.mutateAsync({
        id: selectedUser.id,
        user: formData,
      });

      toast.success("User updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update user.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[40rem]">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit User</DialogTitle>
          <DialogDescription>
            Modify the user information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2">
            {/* First Name & Last Name Row */}
            <div className="flex gap-4">
              {/* First Name */}
              <Controller
                control={form.control}
                name="first_name"
                rules={{ required: "First name is required" }}
                render={({ field, fieldState: { error } }) => (
                  <Field className="w-full">
                    <FieldLabel className="flex items-center gap-2">
                      <User size={16} /> First Name
                    </FieldLabel>
                    <Input placeholder="Enter First Name" {...field} />
                    {error && <FieldError>{error.message}</FieldError>}
                  </Field>
                )}
              />

              {/* Last Name */}
              <Controller
                control={form.control}
                name="last_name"
                rules={{ required: "Last name is required" }}
                render={({ field, fieldState: { error } }) => (
                  <Field className="w-full">
                    <FieldLabel className="flex items-center gap-2">
                      <User size={16} /> Last Name
                    </FieldLabel>
                    <Input placeholder="Enter Last Name" {...field} />
                    {error && <FieldError>{error.message}</FieldError>}
                  </Field>
                )}
              />
            </div>

            {/* Gender & Role Row */}
            <div className="flex gap-4">
              {/* Gender */}
              <Controller
                control={form.control}
                name="gender"
                rules={{ required: "Gender is required" }}
                render={({ field, fieldState: { error } }) => (
                  <Field className="w-full">
                    <FieldLabel className="flex items-center gap-2">
                      <Users size={16} /> Gender
                    </FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    {error && <FieldError>{error.message}</FieldError>}
                  </Field>
                )}
              />

              {/* Role */}
              <Controller
                control={form.control}
                name="role_id"
                rules={{ required: "Role is required" }}
                render={({ field, fieldState: { error } }) => (
                  <Field className="w-full">
                    <FieldLabel className="flex items-center gap-2">
                      <Clipboard size={16} /> Role
                    </FieldLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);

                        // Clear department_id if role is changed to non-staff
                        const selectedRole = roles?.data?.find(
                          (r) => r.id === value,
                        );
                        if (selectedRole?.name.toLowerCase() !== "staff") {
                          form.setValue("department_id", "");
                        }
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select the role this user will be" />
                      </SelectTrigger>
                      <SelectContent>
                        {isRolesLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading roles...
                          </SelectItem>
                        ) : roles?.data ? (
                          roles.data.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="error" disabled>
                            No roles available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {error && <FieldError>{error.message}</FieldError>}
                  </Field>
                )}
              />
            </div>

            {isStaffRole && (
              <Controller
                control={form.control}
                name="department_id"
                rules={{
                  required: isStaffRole
                    ? "Department is required for Staff role"
                    : false,
                }}
                render={({ field, fieldState: { error } }) => (
                  <Field>
                    <FieldLabel className="flex items-center gap-2">
                      <Building size={16} /> Department
                    </FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
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
            )}

            {/* Email */}
            <Controller
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Mail size={16} /> Email
                  </FieldLabel>
                  <Input
                    placeholder="Enter Email Address"
                    type="email"
                    {...field}
                  />
                  {error && <FieldError>{error.message}</FieldError>}
                </Field>
              )}
            />

            {/* Phone Number */}
            <Controller
              control={form.control}
              name="phone_no"
              rules={{ required: "Phone number is required" }}
              render={({ field, fieldState: { error } }) => (
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Phone size={16} /> Phone Number
                  </FieldLabel>
                  <Input placeholder="Enter Phone Number" {...field} />
                  {error && <FieldError>{error.message}</FieldError>}
                </Field>
              )}
            />
          </div>

          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Edit User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
