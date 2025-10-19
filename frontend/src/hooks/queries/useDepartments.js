import { useQuery } from "@tanstack/react-query";
import { departmentsService } from "../../api/services/departmentsService";

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentsService.getAll(),
    staleTime: 1000 * 60 * 1,
  });
};
