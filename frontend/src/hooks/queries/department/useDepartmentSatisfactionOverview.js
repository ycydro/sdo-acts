import { departmentsService } from "@/api/services/departmentsService";
import { useQuery } from "@tanstack/react-query";

export const useDepartmentSatisfactionOverview = () => {
  return useQuery({
    queryKey: ["department-satisfaction-overview"],
    queryFn: () => departmentsService.getDepartmentSatisfactionOverview(),
    staleTime: 1000 * 60 * 5,
  });
};
