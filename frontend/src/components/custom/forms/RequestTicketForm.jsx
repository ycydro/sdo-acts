import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { requestTicketSchema } from "../../../validations/requestTicketSchema";
import clsx from "clsx";
import { format, isSunday, isSaturday } from "date-fns";
import { toast } from "sonner";

import {
  CalendarIcon,
  Building2,
  ClipboardList,
  BookText,
  AlertCircle,
  TriangleAlert,
  Send,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDepartments } from "../../../hooks/queries/department/useDepartments";
import { useServicesByDepartment } from "@/hooks/queries/service/useServicesByDepartment";

import { useAuth } from "@/context/AuthContext";
import { useTicketMutations } from "@/hooks/queries/ticket/useTicketMutations";
import { priorityColors } from "@/lib/constants/priorityColors";

const RequestTicketForm = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { data: departments, isLoading: isDepartmentsLoading } =
    useDepartments();

  const form = useForm({
    resolver: zodResolver(requestTicketSchema),
    defaultValues: {
      department_id: "",
      service_id: "",
      details: "",
      classification: "",
      priority: "",
      date: "",
    },
  });

  // track department_id to trigger services fetch
  const selectedDepartmentID = form.watch("department_id");
  // track service_id
  const selectedServiceId = form.watch("service_id");

  const {
    data: services,
    isLoading: isServicesLoading,
    isError: isServicesError,
  } = useServicesByDepartment(selectedDepartmentID);

  // Find the selected service object
  const selectedService = services?.data?.find(
    (service) => service.id === selectedServiceId
  );

  useEffect(() => {
    if (selectedService && selectedService.classification) {
      form.setValue("classification", selectedService.classification);
    }

    if (selectedService && selectedService.priority) {
      form.setValue("priority", selectedService.priority);
    }
  }, [selectedService, form]);

  // reset mga service related fields kapag nag bago ng selected department
  useEffect(() => {
    if (selectedDepartmentID) {
      form.setValue("service_id", "");
      form.setValue("classification", "");
      form.setValue("priority", "");
    }
  }, [selectedDepartmentID, form]);

  const { createTicket } = useTicketMutations();

  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      scheduled_date: data.date ? format(data.date, "yyyy-MM-dd") : null,
      client_id: user.id,
      is_online: true,
    };
    console.log("Form submitted:", submitData);
    try {
      await createTicket.mutateAsync(submitData);
      toast.success("Ticket created successfully!");
      form.reset();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create ticket.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Department */}
        <Controller
          control={form.control}
          name="department_id"
          render={({ field, fieldState: { error } }) => (
            <Field className="col-span-2">
              <FieldLabel className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-700" />
                Department
              </FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="min-w-full">
                  <SelectValue placeholder="Select what department you want a service from" />
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

        {/* Service */}
        <Controller
          control={form.control}
          name="service_id"
          render={({ field, fieldState: { error } }) => (
            <Field className="col-span-2">
              <FieldLabel className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-gray-700" />
                Service
              </FieldLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedDepartmentID || isServicesLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      !selectedDepartmentID
                        ? "Select a department first"
                        : isServicesLoading
                        ? "Loading services..."
                        : "Select a service"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {!selectedDepartmentID ? (
                    <SelectItem value="no-dept" disabled>
                      Please select a department first
                    </SelectItem>
                  ) : isServicesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading services...
                    </SelectItem>
                  ) : isServicesError ? (
                    <SelectItem value="error" disabled>
                      Failed to load services
                    </SelectItem>
                  ) : services?.data && services.data.length > 0 ? (
                    services.data.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-services" disabled>
                      No services available for this department
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {error && <FieldError>{error.message}</FieldError>}
            </Field>
          )}
        />
        {/* Details */}
        <Controller
          control={form.control}
          name="details"
          render={({ field, fieldState: { error } }) => (
            <Field className="col-span-2">
              <FieldLabel className="flex items-center gap-2">
                <BookText className="w-4 h-4 text-gray-700" />
                Details
              </FieldLabel>
              <Textarea
                placeholder="Brief description of your issue"
                {...field}
              />
              {error && <FieldError>{error.message}</FieldError>}
            </Field>
          )}
        />

        {/* Classification */}
        <Controller
          control={form.control}
          name="classification"
          render={({ field, fieldState: { error } }) => (
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-700" />
                Classification
              </FieldLabel>
              <Input
                readOnly
                className={`bg-gray-100 ${priorityColors[field.value] || ""}`}
                {...field}
              />
              {error && <FieldError>{error.message}</FieldError>}
            </Field>
          )}
        />

        {/* Priority */}
        <Controller
          control={form.control}
          name="priority"
          render={({ field, fieldState: { error } }) => (
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <TriangleAlert className="w-4 h-4 text-gray-700" />
                Priority
              </FieldLabel>
              <Input
                readOnly
                className={`bg-gray-100 ${priorityColors[field.value] || ""}`}
                {...field}
              />
              {error && <FieldError>{error.message}</FieldError>}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="date"
          render={({ field, fieldState: { error } }) => (
            <Field>
              <FieldLabel className="flex items-center gap-2">Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="input">
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date <= new Date() || isSunday(date) || isSaturday(date)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {error && <FieldError>{error.message}</FieldError>}
            </Field>
          )}
        />

        <div className="col-span-2 flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button
            type="button"
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="bg-white w-full sm:w-40 border-2 border-green-700 text-green-700 rounded-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <Button
            type="submit"
            className="w-full sm:w-40 bg-green-700 hover:bg-green-800 text-white rounded-full flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default RequestTicketForm;
