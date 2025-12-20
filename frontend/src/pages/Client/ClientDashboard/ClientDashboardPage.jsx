import React, { useEffect } from "react";
import { addMinutes, format, formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus,
  History,
  Ticket,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { statusColors } from "@/lib/constants/statusColors";
import { useActiveTicket } from "@/hooks/queries/ticket/useActiveTicket";
import { formatTimeDisplay, convertMinutesToTimeParts } from "@/lib/timeUtils";
import { TransactionHistoryList } from "@/components/custom/lists/TransactionHistoryList";
import { ticketsService } from "@/api/services/ticketsService";
import { useCheckCommentsByTicket } from "@/hooks/queries/ticket/comments/useCheckCommentsByTicket";

const ClientDashboardPage = () => {
  const navigate = useNavigate();

  const {
    data: ticket,
    isLoading: isActiveTicketLoading,
    isError: isActiveTicketError,
  } = useActiveTicket();

  const {
    data: newComments,
    isLoading: isNewCommentLoading,
    isError: isNewCommentError,
  } = useCheckCommentsByTicket(ticket?.id);

  const processing_time =
    convertMinutesToTimeParts(ticket?.service?.processing_time_in_minutes) ||
    {};

  const handleViewTicket = async (e) => {
    e?.stopPropagation();

    try {
      if (newComments?.data?.hasNewComments) {
        await ticketsService.markCommentsAsSeen(ticket.id);
      }
    } catch (error) {
      console.error("Failed to mark comments as seen:", error);
    } finally {
      navigate(`/ticket/${ticket.id}`);
    }
  };

  return (
    <main className="w-full space-y-5">
      {/* CTA */}
      <div className="relative">
        <div className="hidden md:grid md:grid-cols-2 gap-6 px-1 md:px-0">
          <Card className="text-center shadow-lg border border-gray-200 flex flex-col justify-center p-6">
            <CardContent className="flex flex-col justify-center items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Plus className="text-green-800 w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <p className="text-xl font-bold">Request a Service</p>
                <p className="text-gray-600 text-sm">
                  Click below to proceed to the official service request form.
                </p>
              </div>
              <Button
                onClick={() => navigate("/request-ticket")}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold text-base px-5 py-2 rounded-full w-full"
              >
                Proceed to Form
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg border border-gray-200 flex flex-col justify-center p-6">
            <CardContent className="flex flex-col justify-center items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <History className="text-green-800 w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <p className="text-xl font-bold">Ticket History</p>
                <p className="text-gray-600 text-sm">
                  View all your previous service requests
                </p>
              </div>
              <Button className="bg-green-700 hover:bg-green-800 text-white font-semibold text-base px-5 py-2 rounded-full w-full">
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Mobile Carousel View */}
        <div className="sm:hidden relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="z-0">
              <CarouselItem className="pl-4 basis-full sm:basis-1/2">
                <Card className="text-center shadow-lg border border-gray-200 flex flex-col justify-center p-6 h-full">
                  <CardContent className="flex flex-col justify-center items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Plus className="text-green-800 w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xl font-bold">Request a Service</p>
                      <p className="text-gray-600 text-sm">
                        Click below to proceed to the official service request
                        form.
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate("/request-ticket")}
                      className="bg-green-700 hover:bg-green-800 text-white font-semibold text-base px-5 py-2 rounded-full w-full"
                    >
                      Proceed to Form
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>

              <CarouselItem className="pl-4 basis-full sm:basis-1/2">
                <Card className="text-center shadow-lg border border-gray-200 flex flex-col justify-center p-6 h-full">
                  <CardContent className="flex flex-col justify-center items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <History className="text-green-800 w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xl font-bold">Ticket History</p>
                      <p className="text-gray-600 text-sm">
                        View all your previous service requests
                      </p>
                    </div>
                    <Button className="bg-green-700 hover:bg-green-800 text-white font-semibold text-base px-5 py-2 rounded-full w-full">
                      View History
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-white" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-white" />
          </Carousel>
        </div>
      </div>
      {/* TICKET INFOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-1">
        <Card className="w-full shadow-lg border border-gray-200 flex flex-col gap-1.5 p-4 sm:p-6 lg:col-span-2 relative">
          <CardHeader className="flex flex-col items-center gap-3 px-0 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 sm:p-3 rounded-full relative">
                <Ticket className="text-green-800 w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xl sm:text-2xl font-semibold">
                  Your Active Ticket
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-4 sm:py-5 flex flex-col items-center w-full mx-auto space-y-4 sm:space-y-5">
            {isActiveTicketLoading ? (
              <p>Loading services...</p>
            ) : isActiveTicketError ? (
              <p className="text-red-600">Failed to load services</p>
            ) : ticket ? (
              <>
                <div className="w-full space-y-2 sm:space-y-1">
                  <div className="flex flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="w-full space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Ticket Code
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                          {ticket.ticket_code || "N/A"}
                        </h3>
                        {newComments?.data?.hasNewComments && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-medium text-red-600">
                              {newComments.data.newCommentCount} new
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium w-fit ${
                        statusColors[ticket.status] ||
                        "bg-gray-100 text-gray-800"
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
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">
                        Ticket Timeline
                      </p>
                      {newComments?.data?.hasNewComments && (
                        <div
                          className="flex items-center gap-1 bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full cursor-pointer transition-all duration-200 hover:bg-red-100 group"
                          onClick={() => handleViewTicket()}
                        >
                          <MessageSquare className="w-3 h-3 transition-transform duration-200 group-hover:scale-110" />
                          <span className="font-medium transition-all duration-200 group-hover:font-semibold">
                            New updates from support
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600">Submitted</span>
                        <span className="font-semibold text-gray-800 text-sm sm:text-base">
                          {format(ticket.createdAt, "MMMM dd, yyyy h:mm a")}
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

                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600">
                          Expected Completion
                        </span>
                        <span className="font-semibold text-gray-800 text-sm sm:text-base">
                          {ticket?.createdAt &&
                          ticket?.service?.processing_time_in_minutes
                            ? format(
                                addMinutes(
                                  ticket.createdAt,
                                  ticket.service.processing_time_in_minutes
                                ),
                                "MMMM dd, yyyy h:mm a"
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex w-full">
                  <Button
                    className="flex-1 border-green-900 py-4 sm:py-6 text-sm sm:text-base"
                    onClick={() => handleViewTicket()}
                  >
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    View Full Details
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full text-center py-8 sm:py-10">
                <div className="bg-gray-100 rounded-full p-3 sm:p-4 w-fit mx-auto mb-3 sm:mb-4">
                  <Ticket className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-base sm:text-lg">
                  No active ticket found
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                  You don't have any active tickets at the moment
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-full flex-shrink-0 lg:col-span-1 shadow-lg border border-gray-200 p-6">
          <CardHeader className="flex items-center justify-center gap-3 w-full pb-3">
            <div className="bg-green-100 p-3 rounded-full w-fit">
              <History className="text-green-800 w-8 h-8" />
            </div>
            <p className="text-2xl font-semibold">Transaction History</p>
          </CardHeader>
          <CardContent className="h-full flex flex-col justify-start px-4 pt-0 pb-4">
            <TransactionHistoryList />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ClientDashboardPage;
