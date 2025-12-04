import express from "express";
import {
  createTicket,
  getAllTickets,
  getTicketStatusCount,
  getUsersCurrentActiveTicket,
  updateTicketStatus,
} from "../controllers/ticket.controller.js";

const router = express.Router();

router.get("/", getAllTickets);

router.get("/ticket-status-count", getTicketStatusCount);
router.get("/active-ticket", getUsersCurrentActiveTicket);

router.post("/", createTicket);

router.put("/update-ticket-status", updateTicketStatus);

export default router;
