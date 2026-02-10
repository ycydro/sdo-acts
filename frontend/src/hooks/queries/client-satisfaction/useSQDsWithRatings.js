import { useQuery } from "@tanstack/react-query";
import { clientSatisfactionService } from "../../../api/services/clientSatisfactionService";

export const useSQDsWithRatings = (departmentID = "") => {
  return useQuery({
    queryKey: ["service-quality-dimensions-with-ratings", departmentID],
    queryFn: () => clientSatisfactionService.getSQDsWithRatings(departmentID),
    staleTime: 1000 * 60 * 5,
  });
};
