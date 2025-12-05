import { useQuery } from "@tanstack/react-query";
import { ticketsService } from "../../../api/services/ticketsService";

export const useTransactionHistory = (pagination = {}, search = "") => {
  const pageIndex = pagination.pageIndex || 0;
  const pageSize = pagination.pageSize || 10;
  return useQuery({
    queryKey: ["transaction-history", pageIndex, pageSize, search],
    queryFn: () =>
      ticketsService.getUserTransactionHistory({
        search,
        page: pageIndex,
        limit: pageSize,
      }),
    staleTime: 1000 * 60 * 1,
  });
};
