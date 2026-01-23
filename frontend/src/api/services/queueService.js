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
        const dateA = new Date(a.scheduled_date);
        const dateB = new Date(b.scheduled_date);
        return dateA - dateB;
      });

    return allTickets;
  },
};
