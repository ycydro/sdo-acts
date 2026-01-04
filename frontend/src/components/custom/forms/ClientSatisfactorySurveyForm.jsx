import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Angry,
  Frown,
  Meh,
  Smile,
  Laugh,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ClientSatisfactorySurveyForm = ({ dimensions, onSubmitSurvey }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: dimensions.reduce((acc, dimension) => {
      acc[dimension.dimension_id] = "";
      return acc;
    }, {}),
    mode: "onChange",
  });

  const ratingOptions = [
    { value: "1", label: "Strongly Disagree", Icon: Angry },
    { value: "2", label: "Disagree", Icon: Frown },
    { value: "3", label: "Neutral", Icon: Meh },
    { value: "4", label: "Agree", Icon: Smile },
    { value: "5", label: "Strongly Agree", Icon: Laugh },
  ];

  const currentDimension = dimensions[currentStep];
  const progress =
    dimensions.length > 0 ? ((currentStep + 1) / dimensions.length) * 100 : 0;

  const currentValue = form.watch(currentDimension?.dimension_id);
  const isCurrentStepValid = Boolean(currentValue);

  const handleNext = () => {
    if (currentStep < dimensions.length - 1 && isCurrentStepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const surveyResponses = Object.entries(data).map(
        ([dimension_id, value]) => ({
          dimension_id,
          dimension: dimensions.find((d) => d.dimension_id === dimension_id)
            ?.dimension_name,
          rating: parseInt(value),
        })
      );

      await onSubmitSurvey(surveyResponses);

      // reset form after successful submission
      form.reset();
      setCurrentStep(0);
    } catch (error) {
      console.error("Error submitting survey:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-background to-muted/20 py-4 sm:py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-4 sm:mb-6 py-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl sm:text-2xl text-center">
              Client Satisfactory Survey
            </CardTitle>
            <p className="text-center text-sm sm:text-base text-muted-foreground mt-1">
              Please rate each scenario below
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Progress</span>
                <span>
                  {currentStep + 1} of {dimensions.length}
                </span>
              </div>
              <Progress value={progress} className="h-1.5 sm:h-2" />
            </div>
          </CardContent>
        </Card>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="py-4">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Question {currentStep + 1} of {dimensions.length}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold mt-0.5">
                    {currentDimension.dimension_name}
                  </h3>
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs sm:text-sm rounded-full self-start sm:self-center">
                  {currentDimension.dimension_code}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6">
              {/* Scenario Text */}
              <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                <p className="text-sm sm:text-base leading-relaxed">
                  "{currentDimension.scenario}"
                </p>
              </div>

              <Controller
                key={currentDimension.dimension_id}
                control={form.control}
                name={currentDimension.dimension_id}
                rules={{ required: "Please select a response to continue" }}
                render={({ field, fieldState: { error } }) => {
                  const fieldValue = form.getValues(
                    currentDimension.dimension_id
                  );

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-5 gap-3 sm:gap-6">
                        {ratingOptions.map(({ value, label, Icon }) => {
                          const isSelected = fieldValue === value;

                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                field.onChange(isSelected ? "" : value)
                              }
                              className={`
                                flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl
                                border transition-all duration-200
                                ${
                                  isSelected
                                    ? "border-primary bg-primary/10 scale-105"
                                    : "border-muted hover:border-primary/50 hover:bg-muted/40"
                                }
                              `}
                            >
                              <Icon
                                className={`
                                w-8 h-8 sm:w-10 sm:h-10
                                ${
                                  isSelected
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }
                              `}
                              />
                              <span
                                className={`
                    text-xs sm:text-sm font-medium text-center
                    ${isSelected ? "text-primary" : "text-muted-foreground"}
                  `}
                              >
                                {label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {error && (
                        <p className="text-sm text-destructive text-center">
                          {error.message}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
              <div className="flex justify-between pt-4 sm:pt-6 border-t">
                <div>
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      size="sm"
                      className="h-9 gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </Button>
                  )}
                </div>

                <div>
                  {currentStep < dimensions.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!isCurrentStepValid || isSubmitting}
                      size="sm"
                      className="h-9 gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!isCurrentStepValid || isSubmitting}
                      size="sm"
                      className="h-9"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit Survey"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center gap-1 sm:gap-2 pt-3">
                {dimensions.map((dimension, index) => {
                  const isCompleted = form.getValues(dimension.dimension_id);
                  const isCurrent = index === currentStep;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (isCompleted || isCurrent || index < currentStep) {
                          setCurrentStep(index);
                        }
                      }}
                      className={`
                        w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200
                        ${
                          isCurrent
                            ? "bg-primary w-4 sm:w-6"
                            : isCompleted
                            ? "bg-primary/50"
                            : "bg-muted"
                        }
                        ${
                          isCompleted || isCurrent || index < currentStep
                            ? "cursor-pointer hover:scale-125"
                            : "cursor-not-allowed"
                        }
                      `}
                      title={
                        isCurrent
                          ? "Current question"
                          : isCompleted
                          ? "Answered"
                          : "Not answered"
                      }
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default ClientSatisfactorySurveyForm;
