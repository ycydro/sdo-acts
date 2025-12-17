import axios from "../axios";

export const clientSatisfactionService = {
  getAllSQDs: async () => {
    const response = await axios.get(
      "/client-satisfaction/service-quality-dimensions"
    );
    return response.data;
  },

  //   create: async (data) => {
  //     const response = await axios.post("/department", data);
  //     return response.data;
  //   },

  //   update: async (id, department) => {
  //     const response = await axios.put(`/department/${id}`, department);
  //     return response.data;
  //   },

  //   delete: async (id) => {
  //     const response = await axios.delete(`/department/${id}`);
  //     return response.data;
  //   },
};
