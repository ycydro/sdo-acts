import { useQuery } from "@tanstack/react-query";
import { rolesService } from "../../../api/services/rolesService";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesService.getAll(),
    staleTime: 1000 * 60 * 1,
  });
};
