import { useState } from "react";
import { useSQDs } from "@/hooks/queries/client-satisfaction/useSQDs";
import ClientSatisfactorySurveyForm from "@/components/custom/forms/ClientSatisfactorySurveyForm";
import { useParams } from "react-router";
import { useSpecificClientSurveyResponse } from "@/hooks/queries/client-satisfaction/useSpecificClientSurveyResponse";
import { useAuth } from "@/context/AuthContext";
import { clientSatisfactionService } from "@/api/services/clientSatisfactionService";

const ClientSatisfactorySurveyPage = () => {
  const { id: ticketID } = useParams();
  const { user } = useAuth();

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

  if (!surveyResponse?.success) {
    return <SurveyUnavailable />;
  }

  const { survey } = surveyResponse;

  const handleSubmitSurvey = async (surveyResponses) => {
    try {
      await clientSatisfactionService.submitSurvey(
        ticketID,
        survey.client_id,
        surveyResponses
      );

      setSurveyResults(surveyResponses);
      setSurveyCompleted(true);

      alert("Survey submitted successfully!");

      // const averageRating =
      //   surveyResponses.reduce((sum, item) => sum + item.rating, 0) /
      //   surveyResponses.length;
      // console.log("Average rating:", averageRating);
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Failed to submit survey. Please try again.");
      throw error; // Let the form handle the error
    }
  };

  // check loading states
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

  // check for errors
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

  // check if user is authenticated
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

  // check if survey exists
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

  // check ticket status
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

  // check if survey has already been answered - allow admins to see anyway
  if (survey.answered || survey.completed_date) {
    return <SurveyAlreadyAnswered />;
  }

  // check if dimensions are loaded
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

  // show survey form for new survey
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
