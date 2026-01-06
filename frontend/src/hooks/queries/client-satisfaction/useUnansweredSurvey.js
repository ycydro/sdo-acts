import { useQuery } from "@tanstack/react-query";
import { clientSatisfactionService } from "@/api/services/clientSatisfactionService";

export const useUnansweredSurvey = () => {
  return useQuery({
    queryKey: ["unaswered-survey"],
    queryFn: () => clientSatisfactionService.getUnansweredSurvey(),
    retry: false,
    staleTime: 0,
  });
};
