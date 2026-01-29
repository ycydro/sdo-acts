import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { ArrowLeft, Edit, Play, Save, X, Copy, CheckLine } from "lucide-react";
import { addMinutes, format, formatDistanceToNow } from "date-fns";
import { useNavigate, useParams } from "react-router";
import { useSpecificTicket } from "@/hooks/queries/ticket/useSpecificTicket";
import { useForm, Controller } from "react-hook-form";
import { convertMinutesToTimeParts, formatTimeDisplay } from "@/lib/timeUtils";
import { statusColors } from "@/lib/constants/statusColors";
import { useTicketMutations } from "@/hooks/queries/ticket/useTicketMutations";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommentSection } from "@/components/custom/modals/Ticket/CommentSection";
import StatusBadge from "@/components/custom/badges/StatusBadge";

const TicketDetailsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: ticket, isLoading } = useSpecificTicket(id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lateStatus, setLateStatus] = useState(null);

  const processing_time =
    convertMinutesToTimeParts(ticket?.service?.processing_time_in_minutes) ||
    {};

  const form = useForm({
    defaultValues: {
      status: ticket?.status || "",
    },
  });

  const { isSubmitting } = form.formState;

  const { updateTicketStatus } = useTicketMutations();

  useEffect(() => {
    if (ticket) {
      form.reset({
        status: ticket.status || "",
      });
    }
  }, [ticket, form]);

  useEffect(() => {
    const currentStatus = form.getValues("status");
    const isFormDirty = currentStatus !== (ticket?.status || "");
    setIsDirty(isFormDirty);
  }, [form.watch("status"), ticket?.status]);

  useEffect(() => {
    if (!ticket?.start_date || !ticket?.service?.processing_time_in_minutes) {
      setLateStatus(null);
      return;
    }

    const expectedCompletion = addMinutes(
      ticket.start_date,
      ticket.service.processing_time_in_minutes,
    );
    const now = new Date();
    const minutesLate = Math.floor((now - expectedCompletion) / (1000 * 60));

    if (minutesLate < 0) {
      setLateStatus("ON SCHEDULE");
      return;
    }

    if (processing_time.days > 0) {
      const daysLate = Math.floor(minutesLate / (60 * 24));
      if (daysLate >= 2) {
        setLateStatus("EXTREMELY LATE");
      } else if (daysLate >= 1) {
        setLateStatus("LATE");
      } else {
        setLateStatus(null);
      }
    } else if (processing_time.hours > 0) {
      const hoursLate = Math.floor(minutesLate / 60);
      if (hoursLate >= 3) {
        setLateStatus("EXTREMELY LATE");
      } else if (hoursLate >= 1) {
        setLateStatus("LATE");
      } else {
        setLateStatus(null);
      }
    } else if (processing_time.minutes > 0) {
      if (minutesLate >= 120) {
        setLateStatus("EXTREMELY LATE");
      } else if (minutesLate >= 30) {
        setLateStatus("LATE");
      } else {
        setLateStatus(null);
      }
    } else {
      setLateStatus(null);
    }
  }, [ticket, processing_time]);

  const handleEditToggle = () => {
    if (isEditMode && isDirty) {
      form.reset({
        status: ticket?.status || "",
      });
    }
    setIsEditMode(!isEditMode);
    setIsDirty(false);
  };

  const unstartedTicket = ticket?.status === "In Queue";
  const isUnapprovedTicket = ticket?.status === "Unapproved";

  const onSubmit = async (data) => {
    console.log("Updating ticket with data:", { id, ...data });
    let ticketData = { id, ...data };

    if (unstartedTicket) {
      ticketData = { ...ticketData, status: "Ongoing" };
    }

    try {
      await updateTicketStatus.mutateAsync(ticketData);
      toast.success("Ticket changed status successfully!");
      setIsEditMode(false);
      setIsDirty(false);
      form.reset({ status: ticketData.status });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update ticket.");
    }
  };

  if (isLoading || !ticket || !ticket.service || !ticket.service.department) {
    return <p>Loading ticket details...</p>;
  }

  const getTicketHeader = (ticket) => {
    if (!ticket || !ticket.service || !ticket.service.department) {
      return "Loading ticket details...";
    }

    return `(${ticket.service.department.department_code}) ${ticket.service.department.name}: ${ticket.service.name}`;
  };

  return (
    <div className="min-w-full">
      {/* HEADER */}
      <div className="mb-2.5">
        {/* Mobile: Back button above title */}
        <div className="lg:hidden mb-3">
          <Button variant="ghost" onClick={() => navigate(-1)} className="px-0">
            <span className="flex gap-1 justify-center items-center">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-lg">Back</span>
            </span>
          </Button>
        </div>

        {/* Desktop: Back button inline with title */}
        <div className="hidden lg:flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8 lg:h-9 lg:w-9 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="sr-only">Back</span>
          </Button>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold break-words">
              {getTicketHeader(ticket)}
            </h1>
          </div>
        </div>

        {/* Mobile: Title below back button */}
        <div className="lg:hidden mb-2">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold break-words">
            {getTicketHeader(ticket)}
          </h1>
        </div>

        <div className="lg:ml-12">
          <p className="text-sm text-muted-foreground">
            Submitted on {format(ticket.createdAt, "MMMM dd, yyyy h:mm a")}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-6">
        {/* LEFT COLUMN - Ticket details and comments */}
        <div className="lg:col-span-2 space-y-2.5">
          {/* CLIENT INFO CARD */}
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
            <CardContent className="py-4 sm:py-5 flex flex-col items-center w-full mx-auto space-y-4 sm:space-y-3.5">
              <div className="w-full space-y-2 sm:space-y-1">
                <div className="flex flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="w-full space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Ticket Code
                      </p>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {ticket.ticket_code || "N/A"}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 border-0 hover:bg-inherit hover:text-primary"
                        onClick={() => {
                          if (ticket.ticket_code) {
                            navigator.clipboard.writeText(ticket.ticket_code);
                            toast.success("Ticket code copied to clipboard");
                          }
                        }}
                        title="Copy ticket code"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <StatusBadge status={ticket.status} />
                  {/* <Badge
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium w-fit ${
                      statusColors[ticket.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {ticket.status || "N/A"}
                  </Badge> */}
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
                    {ticket.start_date && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600">
                          Start Date
                        </span>
                        <span className="font-semibold text-gray-800 text-sm sm:text-base">
                          {format(ticket.start_date, "MMMM dd, yyyy h:mm a")}
                        </span>
                      </div>
                    )}
                    {ticket.end_date && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600">
                          Resolve Date
                        </span>
                        <span className="font-semibold text-gray-800 text-sm sm:text-base">
                          {format(ticket.end_date, "MMMM dd, yyyy h:mm a")}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-600">
                        Estimated Processing Time
                      </span>
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">
                        {formatTimeDisplay(
                          processing_time.days,
                          processing_time.hours,
                          processing_time.minutes,
                        ) || "N/A"}
                      </span>
                    </div>
                    {ticket.start_date && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600">
                          Expected Completion
                        </span>
                        <span className="font-semibold text-gray-800 text-sm sm:text-base">
                          {ticket?.start_date &&
                          ticket?.service?.processing_time_in_minutes
                            ? format(
                                addMinutes(
                                  ticket.start_date,
                                  ticket.service.processing_time_in_minutes,
                                ),
                                "MMMM dd, yyyy h:mm a",
                              )
                            : "N/A"}
                        </span>
                      </div>
                    )}

                    {lateStatus && !unstartedTicket && (
                      <div className="flex justify-start gap-1.5 sm:justify-between items-center pt-2 border-t">
                        <span className="text-sm text-gray-600">Status</span>
                        <Badge
                          className={clsx("font-semibold text-xs sm:text-sm", {
                            "bg-red-100 text-red-800 hover:bg-red-100":
                              lateStatus === "EXTREMELY LATE",
                            "bg-amber-100 text-amber-800 hover:bg-amber-100":
                              lateStatus === "LATE",
                            "bg-green-100 text-green-800 hover:bg-green-100":
                              lateStatus === "ON SCHEDULE",
                          })}
                        >
                          {lateStatus}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* COMMENTS SECTION CARD */}
          <CommentSection
            ticketID={id || null}
            ticketStatus={ticket?.status || null}
          />
        </div>

        {/* RIGHT COLUMN - Ticket fields */}
        <div className="mt-6 lg:mt-0 space-y-6">
          {/* TICKET FIELDS CARD */}
          <Card className="shadow-sm border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="font-semibold text-base lg:text-lg">
                  Ticket Fields
                </h3>
                {user?.permissions?.includes("update_tickets") &&
                  !["Resolved", "Declined"].includes(ticket?.status) && (
                    <Button
                      type="button"
                      variant={isEditMode ? "destructive" : "outline"}
                      size="sm"
                      onClick={handleEditToggle}
                      className="flex items-center gap-2"
                      disabled={isSubmitting}
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
                  )}
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4 lg:space-y-6">
                  {/* DEPARTMENT */}
                  <div>
                    <p className="text-xs lg:text-sm font-medium mb-2 text-gray-700">
                      Department
                    </p>
                    <div className="flex items-center h-10 px-3 py-2 text-sm border rounded-md bg-gray-50 text-gray-900">
                      {ticket?.service?.department?.name || "N/A"}
                    </div>
                  </div>

                  {/* CLASSIFICATION */}
                  <div>
                    <p className="text-xs lg:text-sm font-medium mb-2 text-gray-700">
                      Classification
                    </p>
                    <div className="flex items-center h-10 px-3 py-2 text-sm border rounded-md bg-gray-50 text-gray-900">
                      {ticket?.service.classification || "N/A"}
                    </div>
                  </div>

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
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value}
                          disabled={
                            !isEditMode ||
                            !user?.permissions.includes("update_tickets") ||
                            unstartedTicket ||
                            isUnapprovedTicket ||
                            isSubmitting
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={ticket.status} />
                          </SelectTrigger>
                          <SelectContent>
                            {["Ongoing", "On hold", "Resolved"].map(
                              (status) => (
                                <SelectItem
                                  key={status}
                                  value={status}
                                  disabled={ticket.status === status}
                                >
                                  {status}
                                </SelectItem>
                              ),
                            )}
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

                  {unstartedTicket &&
                    user?.permissions.includes("update_tickets") && (
                      <Button
                        type="submit"
                        disabled={!isEditMode}
                        className="w-full mt-4 flex items-center justify-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Start this Ticket
                      </Button>
                    )}

                  {isUnapprovedTicket &&
                    user?.permissions.includes("update_tickets") && (
                      <div className="flex gap-1.5">
                        <Button
                          type="button"
                          disabled={!isEditMode || isSubmitting}
                          onClick={() => {
                            form.setValue("status", "In Queue");
                            form.handleSubmit(onSubmit)();
                          }}
                          className="flex-1 flex items-center justify-center gap-2"
                        >
                          <CheckLine className="h-4 w-4" />
                          {isSubmitting &&
                          form.getValues("status") === "In Queue"
                            ? "Approving..."
                            : "Approve"}
                        </Button>
                        <Button
                          type="button"
                          disabled={!isEditMode || isSubmitting}
                          onClick={() => {
                            form.setValue("status", "Declined");
                            form.handleSubmit(onSubmit)();
                          }}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                          {isSubmitting &&
                          form.getValues("status") === "Declined"
                            ? "Declining..."
                            : "Decline"}
                        </Button>
                      </div>
                    )}

                  {isEditMode && isDirty && !isUnapprovedTicket && (
                    <Button
                      type="submit"
                      className="w-full mt-4 flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      <Save className="h-4 w-4" />
                      {isSubmitting ? "Updating..." : "Update Ticket"}
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
