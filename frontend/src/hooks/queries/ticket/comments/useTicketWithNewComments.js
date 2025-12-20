import { ticketsService } from "@/api/services/ticketsService";
import { useQuery } from "@tanstack/react-query";

export const useTicketsWithNewComments = () => {
  return useQuery({
    queryKey: ["tickets", "new-comments"],
    queryFn: () => ticketsService.getTicketsWithNewComments(),
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};
