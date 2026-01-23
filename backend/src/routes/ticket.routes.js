import express from "express";
import {
  createTicket,
  getAllTickets,
  getTicketStatusCount,
  getUsersCurrentActiveTicket,
  getUsersTransactionHistory,
  updateTicketStatus,
  getTicketByID,
  getTicketsWithNewComments,
  markTicketCommentsAsSeen,
  markMultipleTicketsCommentsAsSeen,
  checkTicketHasNewComments,
  getQueuedTicketsByDepartment,
  getAllDepartmentsQueue,
} from "../controllers/ticket.controller.js";
import {
  createComment,
  getCommentsByTicket,
} from "../controllers/ticket-comment.controller.js";

const router = express.Router();

router.get("/ticket-status-count", getTicketStatusCount);
router.get("/active-ticket", getUsersCurrentActiveTicket);
router.get("/transaction-history", getUsersTransactionHistory);
router.get("/with-new-comments", getTicketsWithNewComments);

router.get("/", getAllTickets);
router.get("/:id", getTicketByID);

router.post("/", createTicket);
router.put("/update-ticket-status", updateTicketStatus);

// comment routes
router.get("/:ticketID/comments", getCommentsByTicket);
router.get("/:ticketID/has-new-comments", checkTicketHasNewComments);
router.post("/:ticketID/comments", createComment);
router.post("/:ticketID/mark-comments-seen", markTicketCommentsAsSeen);
router.post("/mark-multiple-comments-seen", markMultipleTicketsCommentsAsSeen);

router.get("/queue/by-department", getQueuedTicketsByDepartment);
router.get("/queue/queue-all-departments", getAllDepartmentsQueue);

export default router;
