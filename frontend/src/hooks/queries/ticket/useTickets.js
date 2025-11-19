import { useQuery } from "@tanstack/react-query";
import { ticketsService } from "../../../api/services/ticketsService";

export const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: () => ticketsService.getAll(),
    staleTime: 1000 * 60 * 1,
  });
};
