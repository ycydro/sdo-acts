import { useQuery } from "@tanstack/react-query";
import { ticketsService } from "../../../api/services/ticketsService";

export const useTickets = (pagination = {}, searchQuery = "", filters = {}) => {
  const pageIndex = pagination.pageIndex || 0;
  const pageSize = pagination.pageSize || 10;
  return useQuery({
    queryKey: ["tickets", pagination, searchQuery, filters],
    queryFn: () =>
      ticketsService.getAll({
        search: searchQuery,
        filters: filters,
        page: pageIndex,
        limit: pageSize,
      }),
    staleTime: 1000 * 60 * 1,
  });
};
