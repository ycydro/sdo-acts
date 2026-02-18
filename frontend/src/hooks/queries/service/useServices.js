import { useQuery } from "@tanstack/react-query";
import { servicesService } from "../../../api/services/servicesService";

export const useServices = ({ search = "", filters = {} }) => {
  return useQuery({
    queryKey: ["services", search, filters],
    queryFn: () => servicesService.getAll({ search, filters }),
    staleTime: 1000 * 60 * 1,
  });
};
