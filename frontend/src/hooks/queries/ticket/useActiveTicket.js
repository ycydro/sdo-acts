import { useQuery } from "@tanstack/react-query";
import { ticketsService } from "../../../api/services/ticketsService";

export const useActiveTicket = () => {
  return useQuery({
    queryKey: ["active-ticket"],
    queryFn: () => ticketsService.getActiveTicket(),
    staleTime: 5000,
  });
};
