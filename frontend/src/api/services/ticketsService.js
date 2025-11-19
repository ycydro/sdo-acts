import axios from "../axios";

export const ticketsService = {
  //   getAll: async () => {
  //     const response = await axios.get("/service");
  //     return response.data;
  //   },

  create: async (data) => {
    const response = await axios.post("/ticket", data);
    return response.data;
  },

  //   update: async (id, service) => {
  //     const response = await axios.put(`/service/${id}`, service);
  //     return response.data;
  //   },

  //   delete: async (id) => {
  //     const response = await axios.delete(`/service/${id}`);
  //     return response.data;
  //   },
};
