import { useQuery } from "@tanstack/react-query";
import { servicesService } from "../../../api/services/servicesService";

export const useServicesByDepartment = (departmentID) => {
  return useQuery({
    queryKey: ["services", departmentID],
    queryFn: () => servicesService.getByDepartment(departmentID),
    enabled: !!departmentID, // magfetch kapag may value ung deptID
    staleTime: 1000 * 60 * 1,
  });
};
