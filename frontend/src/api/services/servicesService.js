import { buildQueryParams } from "@/lib/buildQueryParams";
import axios from "../axios";

export const servicesService = {
  getAll: async ({ search, filters }) => {
    const params = buildQueryParams({ search, filters });
    const response = await axios.get("/service", {
      params,
    });
    return response.data;
  },

  getByDepartment: async (departmentId) => {
    const response = await axios.get(`/service/department/${departmentId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post("/service", data);
    return response.data;
  },

  update: async (id, service) => {
    const response = await axios.put(`/service/${id}`, service);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/service/${id}`);
    return response.data;
  },
};
