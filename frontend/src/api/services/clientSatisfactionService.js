import { buildQueryParams } from "@/lib/buildQueryParams";
import axios from "../axios";

export const clientSatisfactionService = {
  getAll: async ({ search, filters, page, limit }) => {
    const params = buildQueryParams({ search, filters, page, limit });
    const response = await axios.get("/client-satisfaction/survey/responses", {
      params,
    });

    return response.data;
  },

  getUnansweredSurvey: async () => {
    const response = await axios.get("/client-satisfaction/survey/unanswered");
    return response.data;
  },

  getAllSQDs: async () => {
    const response = await axios.get(
      "/client-satisfaction/service-quality-dimensions",
    );
    return response.data;
  },

  getSQDsWithRatings: async (departmentID, startDate, endDate) => {
    const response = await axios.get(
      "/client-satisfaction/service-quality-dimensions/with-ratings",
      {
        params: {
          departmentID,
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      },
    );
    return response.data;
  },

  getClientSurveyResponseByID: async (ticketID) => {
    const response = await axios.get(`/client-satisfaction/survey/${ticketID}`);
    return response.data;
  },

  submitSurvey: async (ticketID, clientID, { ratings, comment }) => {
    const response = await axios.post("/client-satisfaction/survey/submit", {
      ticket_id: ticketID,
      client_id: clientID,
      ratings,
      comment,
    });
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
