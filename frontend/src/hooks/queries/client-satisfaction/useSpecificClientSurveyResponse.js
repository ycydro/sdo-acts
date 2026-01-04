import { useQuery } from "@tanstack/react-query";
import { clientSatisfactionService } from "../../../api/services/clientSatisfactionService";

export const useSpecificClientSurveyResponse = (ticketID) => {
  return useQuery({
    queryKey: ["specific-client-survey-response", ticketID],
    queryFn: () =>
      clientSatisfactionService.getClientSurveyResponseByID(ticketID),
    enabled: !!ticketID,
  });
};
