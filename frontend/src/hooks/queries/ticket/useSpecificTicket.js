import { useQuery } from "@tanstack/react-query";
import { ticketsService } from "../../../api/services/ticketsService";

export const useSpecificTicket = (ticketID) => {
  return useQuery({
    queryKey: ["specific-ticket", ticketID],
    queryFn: () => ticketsService.getTicketByID(ticketID),
    enabled: !!ticketID,
  });
};
