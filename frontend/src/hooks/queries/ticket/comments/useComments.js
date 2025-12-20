import { useQuery } from "@tanstack/react-query";
import { commentsService } from "@/api/services/commentsService";

export const useComments = (ticketID, page = 1) => {
  return useQuery({
    queryKey: ["comments", ticketID, page],
    queryFn: () => commentsService.getComments(ticketID, page),
    enabled: !!ticketID,
  });
};
