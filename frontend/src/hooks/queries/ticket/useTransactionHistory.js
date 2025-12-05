import { useQuery } from "@tanstack/react-query";
import { ticketsService } from "../../../api/services/ticketsService";

export const useTransactionHistory = (pagination = {}, searchQuery = "") => {
  const pageIndex = pagination.pageIndex || 0;
  const pageSize = pagination.pageSize || 10;
  return useQuery({
    queryKey: ["transaction-history", pagination, searchQuery],
    queryFn: () =>
      ticketsService.getUserTransactionHistory({
        search: searchQuery,
        page: pageIndex,
        limit: pageSize,
      }),
    staleTime: 1000 * 60 * 1,
  });
};
