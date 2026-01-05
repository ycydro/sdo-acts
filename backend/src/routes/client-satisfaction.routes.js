import express from "express";
import {
  getAllClientSurveyResponses,
  getAllSQDs,
  getSQDsWithRatings,
  getClientSurveyResponseByID,
  submitSurvey,
} from "../controllers/client-satisfaction.controller.js";

const router = express.Router();

// router.get("/ticket-status-count", getTicketStatusCount);
// router.get("/active-ticket", getUsersCurrentActiveTicket);
// router.get("/transaction-history", getUsersTransactionHistory);

router.get("/service-quality-dimensions", getAllSQDs);
router.get("/service-quality-dimensions/with-ratings", getSQDsWithRatings);
router.get("/survey/responses", getAllClientSurveyResponses);
router.get("/survey/:ticket_id", getClientSurveyResponseByID);

// router.get("/:id", getTicketByID);

router.post("/survey/submit", submitSurvey);
// router.post("/", createTicket);
// router.put("/update-ticket-status", updateTicketStatus);

export default router;
