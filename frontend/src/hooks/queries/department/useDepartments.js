import { useQuery } from "@tanstack/react-query";
import { departmentsService } from "../../../api/services/departmentsService";

export const useDepartments = ({ search = "" } = {}) => {
  return useQuery({
    queryKey: ["departments", search],
    queryFn: () => departmentsService.getAll({ search }),
    staleTime: 1000 * 60 * 1,
  });
};
