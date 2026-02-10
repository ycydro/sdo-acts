import { departmentsService } from "@/api/services/departmentsService";
import { useQuery } from "@tanstack/react-query";

export const useDepartmentSatisfactionOverview = (dateRange) => {
  return useQuery({
    queryKey: ["department-satisfaction-overview", dateRange],
    queryFn: () =>
      departmentsService.getDepartmentSatisfactionOverview(dateRange),
    staleTime: 1000 * 60 * 5,
    enabled: !!dateRange,
  });
};
