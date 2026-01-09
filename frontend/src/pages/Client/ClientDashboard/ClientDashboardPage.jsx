import React, { useEffect, useState } from "react";
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
  AlertCircle,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useActiveTicket } from "@/hooks/queries/ticket/useActiveTicket";
import { formatTimeDisplay, convertMinutesToTimeParts } from "@/lib/timeUtils";
import { TransactionHistoryList } from "@/components/custom/lists/TransactionHistoryList";
import { ticketsService } from "@/api/services/ticketsService";
import { useCheckCommentsByTicket } from "@/hooks/queries/ticket/comments/useCheckCommentsByTicket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUnansweredSurvey } from "@/hooks/queries/client-satisfaction/useUnansweredSurvey";
import StatusBadge from "@/components/custom/badges/StatusBadge";

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [surveyTicketId, setSurveyTicketId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const {
    data: surveyData,
    isLoading: isSurveyLoading,
    isError: isSurveyError,
    refetch: refetchSurvey,
  } = useUnansweredSurvey();

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

  const handleRequestService = () => {
    if (isProcessing) return;

    if (ticket) {
      return;
    }

    if (surveyData?.hasUnansweredSurvey) {
      setIsProcessing(true);
      setSurveyTicketId(surveyData.ticket?.id);
      setShowSurveyModal(true);
      setTimeout(() => setIsProcessing(false), 500);
    } else {
      setIsProcessing(true);
      navigate("/request-ticket");
    }
  };

  const handleCompleteSurvey = () => {
    setIsProcessing(true);
    navigate(`/ticket/survey/${surveyTicketId}`);
  };

  // determine if request service should be disabled
  const hasActiveTicket = !!ticket;
  const isRequestDisabled =
    isActiveTicketLoading || hasActiveTicket || isSurveyLoading || isProcessing;

  const getButtonText = () => {
    if (hasActiveTicket) {
      return "Active Ticket in Progress";
    }
    if (surveyData?.hasUnansweredSurvey) {
      return "Answer Survey";
    }
    if (isProcessing) {
      return "Processing...";
    }
    return "Proceed to Form";
  };

  const getCardStyle = () => {
    if (hasActiveTicket) {
      return "border-gray-300 bg-gray-50";
    }
    if (surveyData?.hasUnansweredSurvey) {
      return "border-amber-200 bg-amber-50";
    }
    return "border-gray-200";
  };

  const getIconStyle = () => {
    if (hasActiveTicket) {
      return "bg-gray-200";
    }
    if (surveyData?.hasUnansweredSurvey) {
      return "bg-amber-100";
    }
    return "bg-green-100";
  };

  const getIcon = () => {
    if (hasActiveTicket) {
      return <XCircle className="text-gray-600 w-8 h-8" />;
    }
    if (surveyData?.hasUnansweredSurvey) {
      return <AlertCircle className="text-amber-800 w-8 h-8" />;
    }
    return <Plus className="text-green-800 w-8 h-8" />;
  };

  const getButtonStyle = () => {
    if (hasActiveTicket) {
      return "bg-gray-500 hover:bg-gray-500 cursor-not-allowed";
    }
    if (surveyData?.hasUnansweredSurvey) {
      return "bg-amber-600 hover:bg-amber-700";
    }
    if (isProcessing) {
      return "bg-gray-500 hover:bg-gray-500 cursor-not-allowed";
    }
    return "bg-green-700 hover:bg-green-800";
  };

  const getCardTitle = () => {
    if (hasActiveTicket) {
      return "Service Request Unavailable";
    }
    if (surveyData?.hasUnansweredSurvey) {
      return "Answer Survey to Request Service";
    }
    return "Request a Service";
  };

  const getCardDescription = () => {
    if (hasActiveTicket) {
      return "You already have an active ticket. Please wait for it to be resolved before requesting another service.";
    }
    if (surveyData?.hasUnansweredSurvey) {
      return "Please answer your previous ticket survey to proceed with a new request.";
    }
    return "Click below to proceed to the official service request form.";
  };

  return (
    <main className="w-full space-y-5">
      {/* Survey Required Modal */}
      {/* CREATE SEPARATE COMPONENT FOR THIS MODAL */}
      <Dialog
        open={showSurveyModal}
        onOpenChange={(open) => {
          setShowSurveyModal(open);
          if (!open) setIsProcessing(false);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              <DialogTitle className="text-lg">Complete Survey</DialogTitle>
            </div>
            <DialogDescription>
              {surveyData?.message ||
                "Help us improve by completing a quick survey about your recent service."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-card p-4 space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ticket
                </p>
                <p className="text-base font-semibold text-foreground">
                  {surveyData?.ticket?.ticket_code}
                </p>
              </div>
              {surveyData?.ticket?.service?.name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Service
                  </p>
                  <p className="text-sm text-foreground">
                    {surveyData.ticket.service.name}
                  </p>
                </div>
              )}
              {surveyData?.ticket?.updatedAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Resolved
                  </p>
                  <p className="text-sm text-foreground">
                    {format(
                      new Date(surveyData.ticket.updatedAt),
                      "MMM dd, yyyy"
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSurveyModal(false);
                  setIsProcessing(false);
                }}
                disabled={isProcessing}
              >
                Later
              </Button>
              <Button
                onClick={handleCompleteSurvey}
                disabled={isProcessing}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isProcessing ? "Loading..." : "Continue to survey"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CTA */}
      <div className="relative">
        <div className="hidden md:grid md:grid-cols-2 gap-6 px-1 md:px-0">
          {/* Request Service Card */}
          <Card
            className={`text-center shadow-lg border flex flex-col justify-center p-6 ${getCardStyle()}`}
          >
            <CardContent className="flex flex-col justify-center items-center gap-4">
              <div className={`p-3 rounded-full ${getIconStyle()}`}>
                {getIcon()}
              </div>
              <div className="space-y-1.5">
                <p className="text-xl font-bold">{getCardTitle()}</p>
                <p className="text-gray-600 text-sm">{getCardDescription()}</p>
              </div>
              <Button
                onClick={handleRequestService}
                disabled={isRequestDisabled}
                className={`${getButtonStyle()} text-white font-semibold text-base px-5 py-2 rounded-full w-full`}
              >
                {getButtonText()}
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
                <Card
                  className={`text-center shadow-lg border flex flex-col justify-center p-6 h-full ${getCardStyle()}`}
                >
                  <CardContent className="flex flex-col justify-center items-center gap-4">
                    <div className={`p-3 rounded-full ${getIconStyle()}`}>
                      {getIcon()}
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xl font-bold">{getCardTitle()}</p>
                      <p className="text-gray-600 text-sm">
                        {getCardDescription()}
                      </p>
                    </div>
                    <Button
                      onClick={handleRequestService}
                      disabled={isRequestDisabled}
                      className={`${getButtonStyle()} text-white font-semibold text-base px-5 py-2 rounded-full w-full`}
                    >
                      {getButtonText()}
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
                    <StatusBadge status={ticket.status} />
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
                          <span className="hidden sm:inline font-medium transition-all duration-200 group-hover:font-semibold">
                            New updates from support
                          </span>
                          <span className="inline sm:hidden font-medium transition-all duration-200 group-hover:font-semibold">
                            New updates
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {ticket.start_date ? (
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="text-sm text-gray-600">
                            Start Date
                          </span>
                          <span className="font-semibold text-gray-800 text-sm sm:text-base">
                            {format(ticket.start_date, "MMMM dd, yyyy h:mm a")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="text-sm text-gray-600">
                            Submitted
                          </span>
                          <span className="font-semibold text-gray-800 text-sm sm:text-base">
                            {format(ticket.createdAt, "MMMM dd, yyyy h:mm a")}
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
                            processing_time.minutes
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
                                    ticket.service.processing_time_in_minutes
                                  ),
                                  "MMMM dd, yyyy h:mm a"
                                )
                              : "N/A"}
                          </span>
                        </div>
                      )}
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
