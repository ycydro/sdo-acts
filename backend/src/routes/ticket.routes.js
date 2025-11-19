import express from "express";
import {
  createTicket,
  getAllTickets,
} from "../controllers/ticket.controller.js";

const router = express.Router();

router.get("/", getAllTickets);

router.post("/", createTicket);

export default router;
