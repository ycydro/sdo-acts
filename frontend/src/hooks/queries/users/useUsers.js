import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/api/services/usersService";

export const useUsers = (pagination = {}, searchQuery = "", filters = {}) => {
  const pageIndex = pagination.pageIndex || 0;
  const pageSize = pagination.pageSize || 10;
  return useQuery({
    queryKey: ["users", pagination, searchQuery, filters],
    queryFn: () =>
      usersService.getAll({
        search: searchQuery,
        filters: filters,
        page: pageIndex,
        limit: pageSize,
      }),
    staleTime: 1000 * 60 * 1,
  });
};
