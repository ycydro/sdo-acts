import { useQuery } from "@tanstack/react-query";
import { queueService } from "@/api/services/queueService";

export const useClientQueue = (ticketId) => {
  return useQuery({
    queryKey: ["client-queue", ticketId],
    queryFn: () => queueService.getClientQueue(ticketId),
    enabled: !!ticketId,
    refetchInterval: 30000,
  });
};
