import { useQuery } from "@tanstack/react-query";
import { ticketsService } from "../../../api/services/ticketsService";

export const useTicketStatusCount = () => {
  return useQuery({
    queryKey: ["tickets-status-count"],
    queryFn: () => ticketsService.getTicketStatusCount(),
    staleTime: 5000,
  });
};
