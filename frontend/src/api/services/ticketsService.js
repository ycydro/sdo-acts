import { buildQueryParams } from "@/lib/buildQueryParams";
import axios from "../axios";

export const ticketsService = {
  getAll: async ({ search, filters, page, limit }) => {
    const params = buildQueryParams({ search, filters, page, limit });
    const response = await axios.get("/ticket", { params });

    return response.data;
  },

  getTicketStatusCount: async () => {
    const response = await axios.get("/ticket/ticket-status-count");
    return response.data;
  },

  getActiveTicket: async () => {
    const response = await axios.get("/ticket/active-ticket");
    return response.data.data;
  },

  getTicketByID: async (ticketID) => {
    const response = await axios.get(`/ticket/${ticketID}`);
    return response.data.data;
  },

  getUserTransactionHistory: async ({ search, page, limit }) => {
    const params = buildQueryParams({ search, page, limit });
    const response = await axios.get("/ticket/transaction-history", { params });
    return response.data;
  },

  getTicketsWithNewComments: async () => {
    const response = await axios.get("/ticket/with-new-comments");
    return response.data;
  },

  markCommentsAsSeen: async (ticketID) => {
    const response = await axios.post(
      `/ticket/${ticketID}/mark-comments-seen`,
      {}
    );
    return response.data;
  },

  markMultipleCommentsAsSeen: async (ticketIds) => {
    const response = await axios.post("/ticket/mark-multiple-comments-seen", {
      ticketIds,
    });
    return response.data;
  },

  checkTicketHasNewComments: async (ticketID) => {
    const response = await axios.get(`/ticket/${ticketID}/has-new-comments`);
    return response.data;
  },
  create: async (data) => {
    const response = await axios.post("/ticket", data);
    return response.data;
  },

  changeTicketStatus: async (data) => {
    const response = await axios.put("/ticket/update-ticket-status", data);
    return response.data;
  },
};
