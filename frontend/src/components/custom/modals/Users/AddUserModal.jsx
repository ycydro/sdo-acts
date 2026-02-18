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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";

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
import { useRoles } from "@/hooks/queries/role/useRoles";
import { useDepartments } from "@/hooks/queries/department/useDepartments"; // Assuming you have this hook
import { useUserMutations } from "@/hooks/queries/users/useUserMutations";

const AddUserModal = ({ open, onOpenChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState("");

  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: "",
      role_id: "", // Default value
      department_id: "", // New field
      email: "",
      phone_no: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { data: roles, isLoading: isRolesLoading } = useRoles();
  const { data: departments, isLoading: isDepartmentsLoading } =
    useDepartments();

  const selectedRoleId = form.watch("role_id");

  useEffect(() => {
    if (selectedRoleId && roles?.data) {
      const role = roles.data.find((r) => r.id === selectedRoleId);
      setSelectedRoleName(role?.name || "");

      // Clear department_id if role is not Staff
      if (role?.name.toLowerCase() !== "staff") {
        form.setValue("department_id", "");
      }
    } else {
      setSelectedRoleName("");
    }
  }, [selectedRoleId, roles, form]);

  // Check if the selected role is "Staff"
  const isStaffRole = selectedRoleName.toLowerCase() === "staff";

  useEffect(() => {
    if (!open) {
      form.reset();
      setShowPassword(false);
      setSelectedRoleName("");
    }
  }, [open, form]);

  const { registerUser } = useUserMutations();

  const onSubmit = async (data) => {
    try {
      // extract confirm pass
      const { confirmPassword, ...userData } = data;
      await registerUser.mutateAsync(userData);
      toast.success("User created successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create user.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[40rem]">
        <DialogHeader>
          <DialogTitle className="text-lg">Add User</DialogTitle>
          <DialogDescription>
            Create a new user. Fill in all the required information below.
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

            {/* Password */}
            <Controller
              control={form.control}
              name="password"
              rules={{
                required: "Password is required",
              }}
              render={({ field, fieldState: { error } }) => (
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <ShieldCheck size={16} /> Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      placeholder="Enter Password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye size={18} />
                      ) : (
                        <EyeClosed size={18} />
                      )}
                    </button>
                  </div>
                  {error && <FieldError>{error.message}</FieldError>}
                </Field>
              )}
            />
            {/* Confirm Password */}
            <Controller
              control={form.control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === form.getValues("password") ||
                  "Passwords do not match",
              }}
              render={({ field, fieldState: { error } }) => (
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <ShieldCheck size={16} /> Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <Eye size={18} />
                      ) : (
                        <EyeClosed size={18} />
                      )}
                    </button>
                  </div>
                  {error && <FieldError>{error.message}</FieldError>}
                </Field>
              )}
            />
          </div>

          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              disabled={registerUser.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={registerUser.isPending}>
              Add User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
