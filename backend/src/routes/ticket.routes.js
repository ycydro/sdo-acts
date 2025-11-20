import express from "express";
import {
  createTicket,
  getAllTickets,
  getTicketStatusCount,
} from "../controllers/ticket.controller.js";

const router = express.Router();

router.get("/", getAllTickets);

router.get("/ticket-status-count", getTicketStatusCount);

router.post("/", createTicket);

export default router;
