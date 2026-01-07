import { useState, useEffect } from "react";
import { useSQDs } from "@/hooks/queries/client-satisfaction/useSQDs";
import ClientSatisfactorySurveyForm from "@/components/custom/forms/ClientSatisfactorySurveyForm";
import { useNavigate, useParams } from "react-router";
import { useSpecificClientSurveyResponse } from "@/hooks/queries/client-satisfaction/useSpecificClientSurveyResponse";
import { useAuth } from "@/context/AuthContext";
import { clientSatisfactionService } from "@/api/services/clientSatisfactionService";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Home } from "lucide-react";

const ClientSatisfactorySurveyPage = () => {
  const { id: ticketID } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: surveyResponse,
    isLoading: isSurveyResponseLoading,
    error: surveyError,
    isError: isSurveyError,
  } = useSpecificClientSurveyResponse(ticketID);

  const { data: sqdData, isLoading: isSQDsLoading } = useSQDs();
  const dimensions = sqdData?.data ?? [];

  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [surveyResults, setSurveyResults] = useState(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (surveyCompleted) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate("/dashboard");
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [surveyCompleted, navigate]);

  const handleSubmitSurvey = async (surveyData) => {
    try {
      await clientSatisfactionService.submitSurvey(
        ticketID,
        survey.client_id,
        surveyData
      );

      setSurveyResults(surveyData);
      setSurveyCompleted(true);

      toast.success("Survey has been answered successfully! Thank you!");
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit survey. Please try again."
      );
      throw error;
    }
  };

  if (isSurveyResponseLoading || isSQDsLoading) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (isSurveyError || surveyError) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[400px]">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-semibold mb-2">Error Loading Survey</h2>
          <p className="text-muted-foreground">
            {surveyError?.message ||
              "Failed to load survey data. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  if (!surveyResponse?.success) {
    return <SurveyUnavailable />;
  }

  const { survey } = surveyResponse;

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground mt-2">
          Please log in to access this survey.
        </p>
      </div>
    );
  }

  if (!survey) {
    return <SurveyUnavailable />;
  }

  const isTicketOwner = survey.client_id === user.id;

  if (!isTicketOwner) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-xl font-semibold">Access Restricted</h2>
        <p className="text-muted-foreground mt-2">
          You are not authorized to access this survey. This survey is only
          available to the ticket owner.
        </p>
      </div>
    );
  }

  if (survey.ticket?.status !== "Resolved") {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-xl font-semibold">Survey Not Yet Available</h2>
        <p className="text-muted-foreground mt-2">
          This ticket is currently{" "}
          {survey.ticket?.status?.toLowerCase() || "unresolved"}. The survey
          will be available once the ticket is resolved.
        </p>
      </div>
    );
  }

  if (survey.answered || survey.completed_date) {
    return <SurveyAlreadyAnswered />;
  }

  if (dimensions.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Survey Not Available</h2>
          <p className="text-muted-foreground">
            No survey questions are available at the moment. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  if (surveyCompleted) {
    return (
      <div className="flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 md:p-10 text-center shadow-lg">
          {/* Success Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-15 h-15 sm:w-18 sm:h-18 md:w-20 md:h-20 border-primary rounded-full flex items-center justify-center animate-pulse">
                <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-15 md:h-15 bg-inherit rounded-full flex items-center justify-center">
                  <Check className="text-primary w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                </div>
              </div>
              <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
            Thank You!
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
            Your survey answers have been submitted successfully!
          </p>

          {/* Countdown Display */}
          <div className="mb-8 sm:mb-10">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-50 rounded-full">
              <span className="text-sm sm:text-base text-gray-600">
                Redirecting in
              </span>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100">
                <span className="text-lg sm:text-xl font-bold text-yellow-600">
                  {countdown}
                </span>
              </div>
              <span className="text-sm sm:text-base text-gray-600">
                seconds
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-primary text-white text-sm sm:text-base font-medium py-3 sm:py-4 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg"
            >
              <Home className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <ClientSatisfactorySurveyForm
      dimensions={dimensions}
      onSubmitSurvey={handleSubmitSurvey}
    />
  );
};

const SurveyUnavailable = () => {
  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <h2 className="text-xl font-semibold">Survey Unavailable</h2>
      <p className="text-muted-foreground mt-2">
        There is no survey available for this ticket.
      </p>
    </div>
  );
};

const SurveyAlreadyAnswered = () => {
  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <h2 className="text-xl font-semibold">Thank you!</h2>
      <p className="text-muted-foreground mt-2">
        You've already completed the survey for this ticket.
      </p>
    </div>
  );
};

export default ClientSatisfactorySurveyPage;
