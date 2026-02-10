import axios from "../axios";

export const departmentsService = {
  getAll: async () => {
    const response = await axios.get("/department");
    return response.data;
  },
  getDepartmentSatisfactionOverview: async (dateRange) => {
    let url = "/department/satisfaction-overview";

    // add query parameters for dateRange
    if (dateRange) {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      url += `?${params.toString()}`;
    }

    const response = await axios.get(url);
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post("/department", data);
    return response.data;
  },

  update: async (id, department) => {
    const response = await axios.put(`/department/${id}`, department);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/department/${id}`);
    return response.data;
  },
};
