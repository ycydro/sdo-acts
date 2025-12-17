import { useQuery } from "@tanstack/react-query";
import { clientSatisfactionService } from "../../../api/services/clientSatisfactionService";

export const useSQDs = () => {
  return useQuery({
    queryKey: ["service-quality-dimensions"],
    queryFn: () => clientSatisfactionService.getAllSQDs(),
    staleTime: 1000 * 60 * 1,
  });
};
