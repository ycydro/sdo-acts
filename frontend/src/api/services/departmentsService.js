import axios from "../axios";

export const departmentsService = {
  getAll: async () => {
    const response = await axios.get("/department");
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post("/department", data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/department/${id}`);
    return response.data;
  },
};
