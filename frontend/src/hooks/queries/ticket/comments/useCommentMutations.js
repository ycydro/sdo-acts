import { commentsService } from "@/api/services/commentsService";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const useCommentMutation = () => {
  const queryClient = useQueryClient();

  const createComment = useMutation({
    mutationFn: ({ ticketID, content }) =>
      commentsService.create(ticketID, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.error("Create Comment Error:", error);
    },
  });

  return { createComment };
};
