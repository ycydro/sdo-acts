import { useQuery } from "@tanstack/react-query";
import { servicesService } from "../../../api/services/servicesService";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => servicesService.getAll(),
    staleTime: 1000 * 60 * 1,
  });
};
