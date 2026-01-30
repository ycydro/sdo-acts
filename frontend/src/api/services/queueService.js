import axios from "../axios";

export const queueService = {
  getQueuedTicketOfAllDepartments: async () => {
    const response = await axios.get("/ticket/queue/queue-all-departments");
    return response.data.data;
  },
  getQueuedTicketsByDepartment: async (departmentId) => {
    const response = await axios.get("/ticket/queue/by-department", {
      params: { department_id: departmentId },
    });

    // Extract and flatten tickets from department groups
    const allTickets = Object.values(response.data.data || {})
      .flatMap((dept) => dept.tickets)
      .sort((a, b) => {
        const dateA = new Date(a.confirmation_date);
        const dateB = new Date(b.confirmation_date);
        return dateA - dateB;
      });

    return allTickets;
  },

  getQueueSession: async (departmentId) => {
    const response = await axios.get("/ticket/queue/session/by-department", {
      params: { department_id: departmentId },
    });
    return response.data.data;
  },

  getClientQueue: async (ticketId) => {
    const response = await axios.get("/ticket/queue/client-queue", {
      params: { ticket_id: ticketId },
    });
    return response.data;
  },

  updateQueueSession: async (data) => {
    const response = await axios.post("/ticket/queue/session", data);
    return response.data.data;
  },
};
