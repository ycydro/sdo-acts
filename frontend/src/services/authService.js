import axios from "../lib/axios";

export const loginService = async ({ email, password }) => {
  const response = await axios.post("/auth/login", { email, password });
  console.log(response, "RESPONSE");
  return response.data;
};
