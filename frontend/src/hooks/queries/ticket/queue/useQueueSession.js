import { useQuery } from "@tanstack/react-query";
import { queueService } from "@/api/services/queueService";

export const useQueueSession = (departmentId) => {
  return useQuery({
    queryKey: ["queue-session", departmentId],
    queryFn: () => queueService.getQueueSession(departmentId),
    enabled: !!departmentId,
    staleTime: 1000 * 10,
  });
};
