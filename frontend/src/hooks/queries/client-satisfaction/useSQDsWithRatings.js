import { useQuery } from "@tanstack/react-query";
import { clientSatisfactionService } from "../../../api/services/clientSatisfactionService";

export const useSQDsWithRatings = () => {
  return useQuery({
    queryKey: ["service-quality-dimensions-with-ratings"],
    queryFn: () => clientSatisfactionService.getSQDsWithRatings(),
    staleTime: 1000 * 60 * 5,
  });
};
