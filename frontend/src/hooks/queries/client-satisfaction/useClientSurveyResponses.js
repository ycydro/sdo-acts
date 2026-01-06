import { useQuery } from "@tanstack/react-query";
import { clientSatisfactionService } from "@/api/services/clientSatisfactionService";

export const useClientSurveyResponses = (
  pagination = {},
  searchQuery = "",
  filters = {}
) => {
  const pageIndex = pagination.pageIndex || 0;
  const pageSize = pagination.pageSize || 10;
  return useQuery({
    queryKey: ["client-survey-responses", pagination, searchQuery, filters],
    queryFn: () =>
      clientSatisfactionService.getAll({
        search: searchQuery,
        filters: filters,
        page: pageIndex,
        limit: pageSize,
      }),
    staleTime: 1000 * 60 * 1,
  });
};
