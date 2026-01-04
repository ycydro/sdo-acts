import { useState } from "react";
import { useSQDs } from "@/hooks/queries/client-satisfaction/useSQDs";
import ClientSatisfactorySurveyForm from "@/components/custom/forms/ClientSatisfactorySurveyForm";
import { useParams } from "react-router";
import { useSpecificClientSurveyResponse } from "@/hooks/queries/client-satisfaction/useSpecificClientSurveyResponse";

const ClientSatisfactorySurveyPage = () => {
  const { id: ticketID } = useParams();
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

  const handleSubmitSurvey = async (surveyResponses) => {
    try {
      console.log("Survey responses:", surveyResponses);

      // Here you can add your API call
      // await api.submitSurvey(surveyResponses);

      // Update local states
      setSurveyResults(surveyResponses);
      setSurveyCompleted(true);

      alert("Survey submitted successfully!");

      // You can also do additional processing here
      const averageRating =
        surveyResponses.reduce((sum, item) => sum + item.rating, 0) /
        surveyResponses.length;
      console.log("Average rating:", averageRating);
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

  if (!surveyResponse?.success) {
    return <SurveyUnavailable />;
  }

  const { survey } = surveyResponse;

  // check if survey exists
  if (!survey) {
    return <SurveyUnavailable />;
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

  // check if survey has already been answered
  if (survey.answered || survey.completed_date) {
    return <SurveyAlreadyAnswered />;
  }

  // check if survey is in progress (has been started)
  if (survey.status === "In-Progress") {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Client Satisfaction Survey</h1>
          <p className="text-muted-foreground mt-2">
            You have a survey in progress. Please complete it below.
          </p>
        </div>
        <ClientSatisfactorySurveyForm
          dimensions={dimensions}
          onSubmitSurvey={handleSubmitSurvey}
          initialData={survey.dimensionRatings}
        />
      </div>
    );
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
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Client Satisfaction Survey</h1>
        <p className="text-muted-foreground mt-2">
          Thank you for using our service. Please take a moment to provide
          feedback on your experience.
        </p>
        <div className="mt-4 text-sm text-left bg-gray-50 p-4 rounded-lg">
          <p>
            <strong>Ticket:</strong> {survey.ticket?.ticket_code}
          </p>
          <p>
            <strong>Service:</strong> {survey.ticket?.service?.name}
          </p>
          <p>
            <strong>Department:</strong>{" "}
            {survey.ticket?.service?.department?.name}
          </p>
        </div>
      </div>
      <ClientSatisfactorySurveyForm
        dimensions={dimensions}
        onSubmitSurvey={handleSubmitSurvey}
      />
    </div>
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
