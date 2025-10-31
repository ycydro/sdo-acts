import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { departmentsService } from "../../api/services/departmentsService";

export const useDepartmentMutations = () => {
  const queryClient = useQueryClient();

  const createDepartment = useMutation({
    mutationFn: (data) => departmentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
    },
    onError: (error) => {
      console.error("Create Department Error:", error);
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

  return { createDepartment, deleteDepartment, updateDepartment };
};
