import { authService } from "@/api/services/authService";
import { usersService } from "@/api/services/usersService";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const registerUser = useMutation({
    mutationFn: (data) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.error("Create User Error:", error);
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, user }) => usersService.update(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.error("Update User Error:", error);
    },
  });

  return { registerUser, updateUser };
};
