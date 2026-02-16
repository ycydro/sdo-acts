import { buildQueryParams } from "@/lib/buildQueryParams";
import axios from "../axios";

export const usersService = {
  getAll: async ({ search, filters, page, limit }) => {
    const params = buildQueryParams({ search, filters, page, limit });
    const response = await axios.get("/user", { params });

    return response.data;
  },

  update: async (id, user) => {
    const response = await axios.put(`/user/${id}`, user);
    return response.data;
  },

  //   getTicketByID: async (ticketID) => {
  //     const response = await axios.get(`/ticket/${ticketID}`);
  //     return response.data.data;
  //   },
};
