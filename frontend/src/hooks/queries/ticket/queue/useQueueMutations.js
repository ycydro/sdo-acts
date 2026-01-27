import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { queueService } from "@/api/services/queueService";

export const useQueueMutations = () => {
  const queryClient = useQueryClient();

  const updateQueueSession = useMutation({
    mutationFn: (data) => queueService.updateQueueSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["queue-session"]);
    },
  });

  return { updateQueueSession };
};
