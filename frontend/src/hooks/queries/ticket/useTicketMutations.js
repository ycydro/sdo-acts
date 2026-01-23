import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ticketsService } from "../../../api/services/ticketsService";

export const useTicketMutations = () => {
  const queryClient = useQueryClient();

  const createTicket = useMutation({
    mutationFn: (data) => ticketsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
    },
    onError: (error) => {
      console.error("Create Ticket Error:", error);
    },
  });

  const updateTicketStatus = useMutation({
    mutationFn: (data) => ticketsService.changeTicketStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      queryClient.invalidateQueries({ queryKey: ["queued-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket-status-count"] });
    },
    onError: (error) => {
      console.error("Update Ticket Error:", error);
    },
  });

  // const updateDepartment = useMutation({
  //   mutationFn: ({ id, department }) =>
  //     departmentsService.update(id, department),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["departments"]);
  //   },
  //   onError: (error) => {
  //     console.error("Update Department Error:", error);
  //   },
  // });

  // const deleteDepartment = useMutation({
  //   mutationFn: (id) => departmentsService.delete(id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["departments"]);
  //   },
  //   onError: (error) => {
  //     console.error("Delete Department Error:", error);
  //   },
  // });

  return { createTicket, updateTicketStatus };
};
