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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { useSpecificTicket } from "@/hooks/queries/ticket/useSpecificTicket";
import { useNavigate, useParams } from "react-router";
import { convertMinutesToTimeParts, formatTimeDisplay } from "@/lib/timeUtils";
import { statusColors } from "@/lib/constants/statusColors";

const TicketDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: ticket, isLoading } = useSpecificTicket(id);

  // useEffect(() => {
  //   // ------------------------------
  //   // SIMPLE AUTH CHECK (mock only)
  //   // ------------------------------
  //   const canView = MOCK_TICKET.submitter.id === MOCK_LOGGED_IN_USER.id;
  //   setIsAuthorized(canView);
  // }, []);

  // if (isAuthorized === null) {
  //   return <p className="p-10">Checking ticket access...</p>;
  // }

  // if (!isAuthorized) {
  //   return <Unauthorized />;
  // }

  const processing_time =
    convertMinutesToTimeParts(ticket?.service?.processing_time_in_minutes) ||
    {};

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
          <span className="hidden sm:inline">← Back to Tickets</span>
          <span className="sm:hidden">← Back</span>
        </Button>

        <div className="space-y-1 lg:space-y-2">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
            {getTicketHeader(ticket)}
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Created on {format(ticket.createdAt, "MMMM dd, yyyy h:mm a")}
          </p>
        </div>

        {/* <Badge className="mt-2 lg:mt-3 bg-yellow-200 text-yellow-900 text-xs lg:text-sm">
          This ticket has been {MOCK_TICKET.status} {MOCK_TICKET.resolvedDiff}{" "}
          ago
        </Badge> */}
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
                      <span className="text-sm text-gray-600">Submitted</span>
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">
                        {format(ticket.createdAt, "MMM dd, yyyy")}
                      </span>
                    </div>

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
              <h3 className="font-semibold text-base lg:text-lg mb-4 lg:mb-6">
                Ticket Fields
              </h3>

              <div className="space-y-4 lg:space-y-6">
                {/* STATUS */}
                <div>
                  <label className="text-xs lg:text-sm font-medium mb-2 block">
                    Status
                  </label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={ticket.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* ASSIGNED TO */}
                <div>
                  <label className="text-xs lg:text-sm font-medium mb-2 block">
                    Assigned to
                  </label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Human Resource (HR)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">Human Resource</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* TRANSACTION TYPE */}
                <div>
                  <label className="text-xs lg:text-sm font-medium mb-2 block">
                    Transaction Type
                  </label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={ticket.classification} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Simple">Simple</SelectItem>
                      <SelectItem value="Complex">Complex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
