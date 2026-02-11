import { useQuery } from "@tanstack/react-query";
import { clientSatisfactionService } from "../../../api/services/clientSatisfactionService";

export const useSQDsWithRatings = (departmentID = "", dateRange = null) => {
  return useQuery({
    queryKey: [
      "service-quality-dimensions-with-ratings",
      departmentID,
      dateRange?.startDate,
      dateRange?.endDate,
    ],
    queryFn: () =>
      clientSatisfactionService.getSQDsWithRatings(
        departmentID,
        dateRange?.startDate,
        dateRange?.endDate,
      ),
    staleTime: 1000 * 60 * 5,
  });
};
