import { ticketsService } from "@/api/services/ticketsService";
import { useQuery } from "@tanstack/react-query";

export const useCheckCommentsByTicket = (ticketID) => {
  return useQuery({
    queryKey: ["specific-ticket", ticketID],
    queryFn: () => ticketsService.checkTicketHasNewComments(ticketID),
    enabled: !!ticketID,
  });
};
