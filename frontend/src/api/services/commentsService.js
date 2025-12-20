import axios from "../axios";

export const commentsService = {
  getComments: async (ticketID, page = 1, limit = 10) => {
    const response = await axios.get(`/ticket/${ticketID}/comments`, {
      params: { page, limit },
    });
    return response.data;
  },

  create: async (ticketID, content) => {
    const response = await axios.post(`ticket/${ticketID}/comments`, {
      content,
    });
    return response.data;
  },
};
