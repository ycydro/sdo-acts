import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { ArrowLeft, Edit, Save, X } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useNavigate, useParams } from "react-router";
import { useSpecificTicket } from "@/hooks/queries/ticket/useSpecificTicket";
import { useForm, Controller } from "react-hook-form";
import { convertMinutesToTimeParts, formatTimeDisplay } from "@/lib/timeUtils";
import { statusColors } from "@/lib/constants/statusColors";

const TicketDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: ticket, isLoading } = useSpecificTicket(id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const processing_time =
    convertMinutesToTimeParts(ticket?.service?.processing_time_in_minutes) ||
    {};

  const form = useForm({
    defaultValues: {
      status: "",
      assignedTo: "",
      transactionType: "",
    },
  });

  // Watch for form changes to show/hide update button
  const formWatch = form.watch();
  const formDefaultValues = form.formState.defaultValues;

  useEffect(() => {
    if (ticket) {
      // Set form values from ticket data
      form.reset({
        status: ticket.status || "",
        assignedTo: ticket.assignedTo || "",
        transactionType: ticket.classification || "",
      });
    }
  }, [ticket, form.reset]);

  // Check if form is dirty
  useEffect(() => {
    const isFormDirty =
      formWatch.status !== formDefaultValues?.status ||
      formWatch.assignedTo !== formDefaultValues?.assignedTo ||
      formWatch.transactionType !== formDefaultValues?.transactionType;

    setIsDirty(isFormDirty);
  }, [formWatch, formDefaultValues]);

  const handleEditToggle = () => {
    if (isEditMode && isDirty) {
      form.reset({
        status: ticket.status || "",
        assignedTo: ticket.assignedTo || "",
        transactionType: ticket.classification || "",
      });
    }
    setIsEditMode(!isEditMode);
    setIsDirty(false);
  };

  const onSubmit = async (data) => {
    try {
      console.log("Updating ticket with data:", data);

      // toast.success("Ticket updated successfully!");

      setIsEditMode(false);
      setIsDirty(false);
    } catch (error) {
      console.error("Error updating ticket:", error);
      // toast.error("Failed to update ticket. Please try again.");
    }
  };

  const handleSave = () => {
    form.handleSubmit(onSubmit)();
  };

  if (isLoading) {
    return <p>Loading..</p>;
  }

  const getTicketHeader = (ticket) => {
    return `(${ticket.service.department.department_code}) ${ticket.service.department.name}: ${ticket.service.name}`;
  };

  return (
    <div className="min-w-full">
      {/* HEADER - Full width on all screens */}
      <div className="mb-4 lg:mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-3 lg:mb-4 px-0 lg:px-2"
        >
          <span className="flex gap-1 justify-center items-center">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-lg">Back</span>
          </span>
        </Button>

        <div className="space-y-1 lg:space-y-2">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
            {getTicketHeader(ticket)}
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Submitted on {format(ticket.createdAt, "MMMM dd, yyyy h:mm a")}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-4">
        <div className="lg:col-span-2 space-y-3">
          <Card className="shadow-sm border">
            <CardHeader className="p-2 lg:p-4">
              <div className="flex items-center gap-3 lg:gap-4">
                <Avatar className="w-10 h-10 lg:w-12 lg:h-12">
                  <AvatarFallback className="bg-green-300 text-black text-sm lg:text-base">
                    {String(ticket.client.first_name + ticket.client.last_name)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-base lg:text-lg">
                    {`${ticket.client.first_name} ${ticket.client.last_name}`}
                  </h2>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    reported{" "}
                    {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* TICKET DETAILS CARD */}
          <Card className="shadow-sm border">
            <CardContent className="py-4 sm:py-5 flex flex-col items-center w-full mx-auto space-y-4 sm:space-y-5">
              <div className="w-full space-y-2 sm:space-y-1">
                <div className="flex flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="w-full space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Ticket Code
                      </p>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {ticket.ticket_code || "N/A"}
                    </h3>
                  </div>
                  <Badge
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium w-fit ${
                      statusColors[ticket.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {ticket.status || "N/A"}
                  </Badge>
                </div>
              </div>

              <div className="self-start w-full space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Service
                  </p>
                </div>

                <p className="text-sm sm:text-lg text-gray-600">
                  {ticket.service?.name || "N/A"}
                </p>
              </div>

              <div className="border-t w-full" />

              <div className="w-full space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Ticket Details
                  </p>
                </div>

                <div
                  className="bg-white border rounded-md p-3 sm:p-4 text-sm text-gray-700 leading-relaxed min-h-[40px] sm:min-h-[25px] shadow-sm"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {ticket.details || "No details provided."}
                </div>
              </div>

              <div className="w-full">
                {/* Timeline Section */}
                <div className="bg-gray-50 border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">
                    Ticket Timeline
                  </p>

                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-600">
                        Last Updated
                      </span>
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">
                        {formatDistanceToNow(ticket.updatedAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-600">
                        Estimated Processing Time
                      </span>
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">
                        {formatTimeDisplay(
                          processing_time.days,
                          processing_time.hours,
                          processing_time.minutes
                        ) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - Full width on mobile, 1/3 on desktop */}
        <div className="mt-6 lg:mt-0 space-y-4 lg:space-y-6">
          {/* TICKET FIELDS CARD */}
          <Card className="shadow-sm border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="font-semibold text-base lg:text-lg">
                  Ticket Fields
                </h3>
                <Button
                  type="button"
                  variant={isEditMode ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleEditToggle}
                  className="flex items-center gap-2"
                >
                  {isEditMode ? (
                    <>
                      <X className="h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4 lg:space-y-6">
                  {/* STATUS */}
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field, fieldState: { error } }) => (
                      <Field>
                        <FieldLabel className="text-xs lg:text-sm font-medium mb-2 block">
                          Status
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={ticket.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                        {error && (
                          <FieldError className="text-xs text-red-500 mt-1">
                            {error.message}
                          </FieldError>
                        )}
                      </Field>
                    )}
                  />

                  {/* ASSIGNED TO */}
                  <Controller
                    control={form.control}
                    name="assignedTo"
                    render={({ field, fieldState: { error } }) => (
                      <Field>
                        <FieldLabel className="text-xs lg:text-sm font-medium mb-2 block">
                          Assigned to
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Human Resource (HR)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hr">Human Resource</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="it">IT Department</SelectItem>
                            <SelectItem value="admin">
                              Administration
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {error && (
                          <FieldError className="text-xs text-red-500 mt-1">
                            {error.message}
                          </FieldError>
                        )}
                      </Field>
                    )}
                  />

                  {/* TRANSACTION TYPE */}
                  <Controller
                    control={form.control}
                    name="transactionType"
                    render={({ field, fieldState: { error } }) => (
                      <Field>
                        <FieldLabel className="text-xs lg:text-sm font-medium mb-2 block">
                          Transaction Type
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={ticket.classification} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Simple">Simple</SelectItem>
                            <SelectItem value="Complex">Complex</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        {error && (
                          <FieldError className="text-xs text-red-500 mt-1">
                            {error.message}
                          </FieldError>
                        )}
                      </Field>
                    )}
                  />

                  {/* UPDATE BUTTON - Only shows in edit mode when form is dirty */}
                  {isEditMode && isDirty && (
                    <Button
                      type="button"
                      onClick={handleSave}
                      className="w-full mt-4 flex items-center justify-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Update Ticket
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
