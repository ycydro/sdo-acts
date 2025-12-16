import express from "express";
import { getAllClientFeedbacks } from "../controllers/client-satisfaction.controller.js";

const router = express.Router();

// router.get("/ticket-status-count", getTicketStatusCount);
// router.get("/active-ticket", getUsersCurrentActiveTicket);
// router.get("/transaction-history", getUsersTransactionHistory);

router.get("/", getAllClientFeedbacks);
// router.get("/:id", getTicketByID);

// router.post("/", createTicket);
// router.put("/update-ticket-status", updateTicketStatus);

export default router;
