import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { servicesService } from "../../../api/services/servicesService";

export const useServiceMutations = () => {
  const queryClient = useQueryClient();

  const createService = useMutation({
    mutationFn: (data) => servicesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
    onError: (error) => {
      console.error("Create Service Error:", error);
    },
  });

  const updateDepartment = useMutation({
    mutationFn: ({ id, department }) =>
      departmentsService.update(id, department),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
    },
    onError: (error) => {
      console.error("Update Department Error:", error);
    },
  });

  const deleteDepartment = useMutation({
    mutationFn: (id) => departmentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
    },
    onError: (error) => {
      console.error("Delete Department Error:", error);
    },
  });

  return { createService, deleteDepartment, updateDepartment };
};
