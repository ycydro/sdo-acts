import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import * as XLSX from "xlsx";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
  Upload,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Check,
  X,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useRoles } from "@/hooks/queries/role/useRoles";
import { useDepartments } from "@/hooks/queries/department/useDepartments";
import { useUserMutations } from "@/hooks/queries/users/useUserMutations";

const BULK_PAGE_SIZE = 5;

const BulkRowEditor = ({
  row,
  index,
  roles,
  departments,
  onChange,
  onDelete,
}) => {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState({ ...row });

  const roleOptions = roles?.data || [];
  const deptOptions = departments?.data || [];

  const commit = () => {
    onChange(index, local);
    setEditing(false);
  };

  const cancel = () => {
    setLocal({ ...row });
    setEditing(false);
  };

  const roleName =
    roleOptions.find((r) => r.id === local.role_id)?.name || local.role || "—";
  const deptName =
    deptOptions.find((d) => d.id === local.department_id)?.name ||
    local.department_id ||
    "—";

  if (editing) {
    return (
      <tr className="bg-blue-50">
        {["first_name", "last_name", "email", "phone_no", "password"].map(
          (f) => (
            <td key={f} className="px-3 py-2">
              <Input
                className="h-7 text-xs"
                value={local[f] || ""}
                onChange={(e) =>
                  setLocal((p) => ({ ...p, [f]: e.target.value }))
                }
              />
            </td>
          ),
        )}
        <td className="px-3 py-2">
          <Select
            value={local.role_id || ""}
            onValueChange={(v) => {
              const r = roleOptions.find((r) => r.id === v);
              setLocal((p) => ({
                ...p,
                role_id: v,
                role: r?.name || "",
                department_id:
                  r?.name?.toLowerCase() !== "staff" ? "" : p.department_id,
              }));
            }}
          >
            <SelectTrigger className="h-7 text-xs w-28">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="px-3 py-2">
          {local.role?.toLowerCase() === "staff" ? (
            <Select
              value={local.department_id || ""}
              onValueChange={(v) =>
                setLocal((p) => ({ ...p, department_id: v }))
              }
            >
              <SelectTrigger className="h-7 text-xs w-32">
                <SelectValue placeholder="Dept" />
              </SelectTrigger>
              <SelectContent>
                {deptOptions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-xs text-gray-400 italic">N/A</span>
          )}
        </td>
        <td className="px-3 py-2">
          <Select
            value={local.sex || ""}
            onValueChange={(v) => setLocal((p) => ({ ...p, sex: v }))}
          >
            <SelectTrigger className="h-7 text-xs w-24">
              <SelectValue placeholder="Sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
        </td>
        <td className="px-3 py-2">
          <div className="flex gap-1">
            <button
              onClick={commit}
              className="p-1 rounded text-green-600 hover:bg-green-100"
            >
              <Check size={14} />
            </button>
            <button
              onClick={cancel}
              className="p-1 rounded text-gray-500 hover:bg-gray-100"
            >
              <X size={14} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  const hasError = row._errors?.length > 0;

  return (
    <tr
      className={`border-b text-xs hover:bg-gray-50 ${hasError ? "bg-red-50" : ""}`}
    >
      <td className="px-3 py-2">{row.first_name}</td>
      <td className="px-3 py-2">{row.last_name}</td>
      <td className="px-3 py-2 max-w-[140px] truncate">{row.email}</td>
      <td className="px-3 py-2">{row.phone_no}</td>
      <td className="px-3 py-2 text-gray-400">••••••</td>
      <td className="px-3 py-2">
        <Badge variant="outline" className="text-xs">
          {roleName}
        </Badge>
      </td>
      <td className="px-3 py-2 max-w-[100px] truncate">
        {deptName || <span className="text-gray-400 italic">N/A</span>}
      </td>
      <td className="px-3 py-2">{row.sex}</td>
      <td className="px-3 py-2">
        <div className="flex gap-1 items-center">
          {hasError && (
            <span title={row._errors.join(", ")} className="text-red-500">
              <AlertCircle size={14} />
            </span>
          )}
          <button
            onClick={() => setEditing(true)}
            className="p-1 rounded text-blue-500 hover:bg-blue-100"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(index)}
            className="p-1 rounded text-red-400 hover:bg-red-100"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const AddUserModal = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("single");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState("");

  // Bulk state
  const [bulkUsers, setBulkUsers] = useState([]);
  const [bulkPage, setBulkPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: "",
      role_id: "",
      department_id: "",
      email: "",
      phone_no: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { data: roles, isLoading: isRolesLoading } = useRoles();
  const { data: departments, isLoading: isDepartmentsLoading } =
    useDepartments();
  const { registerUser, bulkRegisterUsers } = useUserMutations();

  const selectedRoleId = form.watch("role_id");
  const isStaffRole = selectedRoleName.toLowerCase() === "staff";

  useEffect(() => {
    if (selectedRoleId && roles?.data) {
      const role = roles.data.find((r) => r.id === selectedRoleId);
      setSelectedRoleName(role?.name || "");
      if (role?.name.toLowerCase() !== "staff")
        form.setValue("department_id", "");
    } else {
      setSelectedRoleName("");
    }
  }, [selectedRoleId, roles, form]);

  useEffect(() => {
    if (!open) {
      form.reset();
      setShowPassword(false);
      setShowConfirmPassword(false);
      setSelectedRoleName("");
      setBulkUsers([]);
      setBulkPage(1);
      setActiveTab("single");
    }
  }, [open, form]);

  //Excel parsing
  const validateRow = useCallback((row, rolesList) => {
    const errors = [];
    if (!row.first_name) errors.push("Missing first_name");
    if (!row.last_name) errors.push("Missing last_name");
    if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email))
      errors.push("Invalid email");
    if (!row.password) errors.push("Missing password");
    if (!row.role_id) errors.push("Unrecognized role");
    else {
      const role = rolesList?.find((r) => r.id === row.role_id);
      if (role?.name?.toLowerCase() === "staff" && !row.department_id)
        errors.push("Staff requires department");
    }
    return errors;
  }, []);

  const parseExcel = useCallback(
    (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target.result, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const raw = XLSX.utils.sheet_to_json(ws, { defval: "" });

          const rolesList = roles?.data || [];
          const deptList = departments?.data || [];

          const emailSet = new Set();
          const uniqueUsers = [];

          for (const r of raw) {
            // Normalize keys (trim, lowercase)
            const norm = {};
            Object.entries(r).forEach(([k, v]) => {
              norm[k.trim().toLowerCase()] = String(v).trim();
            });

            const email = norm.email || "";

            // Skip if duplicate email
            if (emailSet.has(email.toLowerCase())) {
              continue;
            }

            // Resolve role name → id
            const roleName = norm.role || norm.role_name || "";
            const matchedRole = rolesList.find(
              (rl) => rl.name.toLowerCase() === roleName.toLowerCase(),
            );

            // Resolve department name → id (optional)
            const deptIdentifier =
              norm.department || norm.department_name || "";
            const matchedDept = deptList.find(
              (d) =>
                d.name.toLowerCase() === deptIdentifier.toLowerCase() ||
                d.department_code.toLowerCase() ===
                  deptIdentifier.toLowerCase(),
            );

            const user = {
              first_name:
                norm.first_name || norm.firstname || norm["first name"] || "",
              last_name:
                norm.last_name || norm.lastname || norm["last name"] || "",
              email: email,
              phone_no:
                norm.phone_no ||
                norm.phone ||
                norm.mobile ||
                norm.mobile_number ||
                "",
              password: norm.password || "",
              sex: norm.sex || norm.gender || "",
              role: roleName,
              role_id: matchedRole?.id || "",
              department_id: matchedDept?.id || "",
            };

            user._errors = validateRow(user, rolesList);

            emailSet.add(email.toLowerCase());
            uniqueUsers.push(user);
          }

          if (raw.length !== uniqueUsers.length) {
            toast.warning(
              `Removed ${raw.length - uniqueUsers.length} duplicate email(s)`,
            );
          }

          setBulkUsers(uniqueUsers);
          setBulkPage(1);
        } catch (err) {
          toast.error("Failed to parse Excel file");
          console.error(err);
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [roles, departments, validateRow],
  );

  const handleFileDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
      if (file) parseExcel(file);
    },
    [parseExcel],
  );

  const handleRowChange = useCallback(
    (globalIndex, updated) => {
      setBulkUsers((prev) => {
        const next = [...prev];
        updated._errors = validateRow(updated, roles?.data || []);
        next[globalIndex] = updated;
        return next;
      });
    },
    [validateRow, roles],
  );

  const handleRowDelete = useCallback((globalIndex) => {
    setBulkUsers((prev) => prev.filter((_, i) => i !== globalIndex));
  }, []);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(bulkUsers.length / BULK_PAGE_SIZE));
  const pagedUsers = bulkUsers.slice(
    (bulkPage - 1) * BULK_PAGE_SIZE,
    bulkPage * BULK_PAGE_SIZE,
  );
  const errorCount = bulkUsers.filter((u) => u._errors?.length > 0).length;

  const onSingleSubmit = async (data) => {
    try {
      const { confirmPassword, ...userData } = data;
      await registerUser.mutateAsync(userData);
      toast.success("User created successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user.");
    }
  };

  const onBulkConfirm = async () => {
    if (errorCount > 0) {
      toast.error(`Fix ${errorCount} error(s) before confirming`);
      return;
    }
    setIsBulkSubmitting(true);
    try {
      // Strip internal _errors field before sending
      const payload = bulkUsers.map(({ _errors, role, ...u }) => u);
      await bulkRegisterUsers.mutateAsync(payload);
      toast.success(`${payload.length} users created successfully!`);
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Bulk insert failed.");
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  const isBulkTab = activeTab === "bulk";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`transition-all duration-4 ${isBulkTab && bulkUsers.length > 0 ? "min-w-[72rem]" : "min-w-[40rem]"}`}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">Add User</DialogTitle>
          <DialogDescription>
            Create a single user or bulk-import from an Excel file.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="single" className="flex-1 gap-2">
              <User size={15} /> Single User
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex-1 gap-2">
              <FileSpreadsheet size={15} /> Bulk Import
              {bulkUsers.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {bulkUsers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/*Single Tab*/}
          <TabsContent value="single">
            <form onSubmit={form.handleSubmit(onSingleSubmit)}>
              <div className="space-y-4 py-2">
                <div className="flex gap-4">
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

                <div className="flex gap-4">
                  <Controller
                    control={form.control}
                    name="gender"
                    rules={{ required: "Gender is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Field className="w-full">
                        <FieldLabel className="flex items-center gap-2">
                          <Users size={16} /> Gender
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
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
                          onValueChange={(v) => {
                            field.onChange(v);
                            const r = roles?.data?.find((r) => r.id === v);
                            if (r?.name.toLowerCase() !== "staff")
                              form.setValue("department_id", "");
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="min-w-full">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {isRolesLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : (
                              roles?.data?.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))
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
                        ? "Department is required for Staff"
                        : false,
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Field>
                        <FieldLabel className="flex items-center gap-2">
                          <Building size={16} /> Department
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {isDepartmentsLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : (
                              departments?.data?.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {error && <FieldError>{error.message}</FieldError>}
                      </Field>
                    )}
                  />
                )}

                <Controller
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email",
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

                <Controller
                  control={form.control}
                  name="password"
                  rules={{ required: "Password is required" }}
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

                <Controller
                  control={form.control}
                  name="confirmPassword"
                  rules={{
                    required: "Please confirm your password",
                    validate: (v) =>
                      v === form.getValues("password") ||
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
          </TabsContent>

          {/*Bulk Tab*/}
          <TabsContent value="bulk">
            {bulkUsers.length === 0 ? (
              /* Drop zone */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center gap-4 transition-colors cursor-pointer ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
                onClick={() =>
                  document.getElementById("bulk-file-input").click()
                }
              >
                <input
                  id="bulk-file-input"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleFileDrop}
                />
                <div className="p-4 rounded-full bg-gray-100">
                  <Upload size={32} className="text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-700">
                    Drop your Excel file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports .xlsx, .xls
                  </p>
                </div>
                <div className="text-xs text-gray-400 bg-gray-50 rounded p-3 w-full max-w-sm">
                  <p className="font-semibold mb-1 text-gray-600">
                    Expected columns:
                  </p>
                  <p>
                    first_name, last_name, email, password, phone_no, role, sex,
                    department (optional)
                  </p>
                </div>
              </div>
            ) : (
              /* User table */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-medium">
                      {bulkUsers.length} users loaded
                    </span>
                    {errorCount > 0 && (
                      <Badge variant="destructive" className="gap-1 text-xs">
                        <AlertCircle size={12} /> {errorCount} error
                        {errorCount > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={() => {
                      setBulkUsers([]);
                      setBulkPage(1);
                    }}
                  >
                    <Upload size={13} /> Replace File
                  </Button>
                </div>

                <div className="border rounded-lg overflow-auto max-h-[360px]">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0 border-b">
                      <tr>
                        {[
                          "First Name",
                          "Last Name",
                          "Email",
                          "Phone",
                          "Password",
                          "Role",
                          "Department",
                          "Sex",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pagedUsers.map((user, pageIdx) => {
                        const globalIndex =
                          (bulkPage - 1) * BULK_PAGE_SIZE + pageIdx;
                        return (
                          <BulkRowEditor
                            key={globalIndex}
                            row={user}
                            index={globalIndex}
                            roles={roles}
                            departments={departments}
                            onChange={handleRowChange}
                            onDelete={handleRowDelete}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Page {bulkPage} of {totalPages} · {bulkUsers.length} total
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      disabled={bulkPage <= 1}
                      onClick={() => setBulkPage((p) => p - 1)}
                    >
                      <ChevronLeft size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      disabled={bulkPage >= totalPages}
                      onClick={() => setBulkPage((p) => p + 1)}
                    >
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="mt-5">
              <Button
                type="button"
                variant="outline"
                disabled={isBulkSubmitting}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              {bulkUsers.length > 0 && (
                <Button
                  onClick={onBulkConfirm}
                  disabled={isBulkSubmitting || errorCount > 0}
                  className="gap-2"
                >
                  {isBulkSubmitting
                    ? "Inserting..."
                    : `Confirm & Insert ${bulkUsers.length} User 
                        ${bulkUsers > 1 ? "s" : ""}
                    `}
                </Button>
              )}
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
