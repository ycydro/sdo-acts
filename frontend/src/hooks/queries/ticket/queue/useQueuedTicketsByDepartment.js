import { useQuery } from "@tanstack/react-query";
import { queueService } from "@/api/services/queueService";

export const useQueuedTicketsByDepartment = (departmentId) => {
  return useQuery({
    queryKey: ["queued-tickets", departmentId],
    queryFn: () => queueService.getQueuedTicketsByDepartment(departmentId),
    refetchInterval: 30000,
    staleTime: 20000,
    enabled: !!departmentId,
  });
};
