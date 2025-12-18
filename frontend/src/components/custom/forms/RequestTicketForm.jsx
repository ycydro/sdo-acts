import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { requestTicketSchema } from "../../../validations/requestTicketSchema";
import { format, isSunday, isSaturday, addDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import {
  CalendarIcon,
  ClipboardList,
  BookText,
  AlertCircle,
  TriangleAlert,
  Send,
  ArrowLeft,
  Clock,
  ChevronsUpDown,
  Check,
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

import { useServices } from "@/hooks/queries/service/useServices";
import { useAuth } from "@/context/AuthContext";
import { useTicketMutations } from "@/hooks/queries/ticket/useTicketMutations";
import { priorityColors } from "@/lib/constants/priorityColors";
import { convertMinutesToTimeParts, formatTimeDisplay } from "@/lib/timeUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const RequestTicketForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

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

  const selectedServiceId = form.watch("service_id");
  const [open, setOpen] = useState(false);

  const {
    data: services,
    isLoading: isServicesLoading,
    isError: isServicesError,
  } = useServices();

  // Find the selected service object
  const selectedService = services?.data?.find(
    (service) => service.id === selectedServiceId
  );

  // calculate processing time when service is selected
  const processingTime = selectedService?.processing_time_in_minutes
    ? convertMinutesToTimeParts(selectedService.processing_time_in_minutes)
    : {};

  // Set classification and priority when service is selected
  useEffect(() => {
    if (selectedService) {
      if (selectedService.classification) {
        form.setValue("classification", selectedService.classification);
      }
      if (selectedService.priority) {
        form.setValue("priority", selectedService.priority);
      }
      // set department_id from the selected service (patago)
      if (selectedService.department_id) {
        form.setValue("department_id", selectedService.department_id);
      }
    }
  }, [selectedService, form]);

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

  // desktop combobox
  const DesktopServiceCombobox = ({ field, error }) => (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between border-input hover:bg-inherit hover:text-muted-foreground",
            !field.value && "text-muted-foreground",
            isServicesLoading && "opacity-50 cursor-not-allowed"
          )}
          disabled={isServicesLoading}
        >
          {isServicesLoading
            ? "Loading services..."
            : field.value
            ? services?.data?.find((service) => service.id === field.value)
                ?.name || "Select a service"
            : "Select a service"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)]"
        align="start"
      >
        <ServiceCommandList setOpen={setOpen} field={field} />
      </PopoverContent>
    </Popover>
  );

  // for mobile
  const MobileServiceCombobox = ({ field, error }) => (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between truncate border-input hover:bg-inherit hover:text-muted-foreground",
            !field.value && "text-muted-foreground",
            isServicesLoading && "opacity-50 cursor-not-allowed"
          )}
          disabled={isServicesLoading}
        >
          {isServicesLoading
            ? "Loading services..."
            : field.value
            ? services?.data?.find((service) => service.id === field.value)
                ?.name || "Select a service"
            : "Select a service"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ServiceCommandList setOpen={setOpen} field={field} />
        </div>
      </DrawerContent>
    </Drawer>
  );

  const ServiceCommandList = ({ setOpen, field }) => {
    return (
      <Command
        shouldFilter={true}
        filter={(value, search) => {
          // Custom filter function to only search in service name
          const service = services?.data?.find((s) => s.id === value);
          if (!service) return 0;

          // Check if search term is in service name (case-insensitive)
          const matches = service.name
            .toLowerCase()
            .includes(search.toLowerCase());

          return matches ? 1 : 0;
        }}
      >
        <CommandInput
          placeholder={
            services?.data?.length
              ? `Search within ${services.data.length} available services...`
              : "Search services..."
          }
        />
        <CommandList>
          <CommandEmpty>
            {isServicesError
              ? "Failed to load services"
              : "No matching services found"}
          </CommandEmpty>
          <CommandGroup>
            {isServicesLoading ? (
              <CommandItem disabled>Loading services...</CommandItem>
            ) : services?.data && services.data.length > 0 ? (
              services.data.map((service) => (
                <CommandItem
                  key={service.id}
                  value={service.id}
                  onSelect={() => {
                    field.onChange(service.id);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start py-3"
                >
                  <div className="flex items-center w-full">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-primary",
                        field.value === service.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col items-start flex-1">
                      <span className="font-medium">{service.name}</span>
                      {service.department && (
                        <span className="text-xs text-gray-500">
                          {service.department.name}
                        </span>
                      )}
                    </div>
                    {service.processing_time_in_minutes && (
                      <div className="text-gray-500 ml-3 text-sm">
                        Est. time:{" "}
                        {formatTimeDisplay(
                          convertMinutesToTimeParts(
                            service.processing_time_in_minutes
                          ).days,
                          convertMinutesToTimeParts(
                            service.processing_time_in_minutes
                          ).hours,
                          convertMinutesToTimeParts(
                            service.processing_time_in_minutes
                          ).minutes
                        )}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))
            ) : (
              <CommandItem disabled>No services available</CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Service - Now showing all services */}
        <Controller
          control={form.control}
          name="service_id"
          render={({ field, fieldState: { error } }) => (
            <Field className="col-span-2">
              <FieldLabel className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-gray-700" />
                Service
              </FieldLabel>
              {isMobile ? (
                <MobileServiceCombobox field={field} error={error} />
              ) : (
                <DesktopServiceCombobox field={field} error={error} />
              )}
              {error && <FieldError>{error.message}</FieldError>}
            </Field>
          )}
        />

        {/* Estimated Processing Time Display */}
        {selectedService?.processing_time_in_minutes && (
          <div className="col-span-2 bg-emerald-50 border border-primary/55 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary/70" />
              <span className="text-sm font-medium text-primary">
                Estimated Processing Time:
              </span>
              <span className="ml-auto font-semibold text-primary">
                {formatTimeDisplay(
                  processingTime.days,
                  processingTime.hours,
                  processingTime.minutes
                )}
              </span>
            </div>
          </div>
        )}

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

        {/* Classification and Priority Container */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Date */}
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
                      date <= new Date(addDays(new Date(), 3)) ||
                      isSunday(date) ||
                      isSaturday(date)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {error && <FieldError>{error.message}</FieldError>}
            </Field>
          )}
        />

        {/* Buttons */}
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
