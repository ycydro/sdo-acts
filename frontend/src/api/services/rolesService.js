import axios from "../axios";

export const rolesService = {
  getAll: async () => {
    console.log("NANDITO AKO");
    const response = await axios.get("/role");
    return response.data;
  },
};
