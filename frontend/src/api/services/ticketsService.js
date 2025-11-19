import { buildQueryParams } from "@/lib/buildQueryParams";
import axios from "../axios";

export const ticketsService = {
  getAll: async ({ search, filters, page, limit }) => {
    const params = buildQueryParams({ search, filters, page, limit });
    const response = await axios.get("/ticket", { params });

    return response.data;
  },

  create: async (data) => {
    const response = await axios.post("/ticket", data);
    return response.data;
  },
};
