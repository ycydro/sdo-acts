import axios from "../lib/axios";

export const loginService = async ({ email, password }) => {
  const response = await axios.post("/auth/login", { email, password });
  return response.data;
};
