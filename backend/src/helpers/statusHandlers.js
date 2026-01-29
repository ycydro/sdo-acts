import {
  Ticket,
  Service,
  Department,
  User,
  TicketComment,
  TicketView,
  ClientSurveyResponse,
} from "../models/index.js";
import { Op, Sequelize } from "sequelize";

const handleInQueueStatus = async (ticket, updatedTicketData, transaction) => {
  if (ticket.status === "Unapproved") {
    updatedTicketData.confirmation_date = new Date();

    console.log(
      `Ticket ${ticket.ticket_code} started at ${updatedTicketData.start_date}`,
    );
  }

  updatedTicketData.start_date = null;
  updatedTicketData.end_date = null;
  console.log(`Ticket ${ticket.ticket_code} moved to In Queue`);
};

const handleOngoingStatus = async (ticket, updatedTicketData, transaction) => {
  // add start_date if status is being changed to 'Ongoing' from 'In Queue'
  if (ticket.status === "In Queue") {
    updatedTicketData.start_date = new Date();
    console.log(
      `Ticket ${ticket.ticket_code} started at ${updatedTicketData.start_date}`,
    );
  }

  // reset end_date if moving from Resolved to Ongoing
  if (ticket.status === "Resolved") {
    updatedTicketData.end_date = null;
  }
};

const handleResolvedStatus = async (ticket, updatedTicketData, transaction) => {
  // add end_date if status is being changed to 'Resolved'
  if (ticket.status !== "Resolved") {
    updatedTicketData.end_date = new Date();
    console.log(
      `Ticket ${ticket.ticket_code} resolved at ${updatedTicketData.end_date}`,
    );
  }

  // create survey for resolved tickets
  if (ticket.status !== "Resolved") {
    const existingSurvey = await ClientSurveyResponse.findOne({
      where: { ticket_id: ticket.ticket_code },
      transaction,
    });

    if (!existingSurvey) {
      await ClientSurveyResponse.create(
        {
          client_id: ticket.client_id,
          ticket_id: ticket.ticket_code,
          survey_date: new Date(),
          status: "Pending",
          overall_rating: null,
          total_score: null,
          comments: null,
        },
        { transaction },
      );

      console.log(`Created unanswered survey for ticket ${ticket.ticket_code}`);
    }
  }
};

const handleOnHoldStatus = async (ticket, updatedTicketData, transaction) => {
  console.log(`Ticket ${ticket.ticket_code} placed on hold`);
};

const handleUnapprovedStatus = async (
  ticket,
  updatedTicketData,
  transaction,
) => {
  console.log(`Ticket ${ticket.ticket_code} marked as unapproved`);
};

const handleDeclinedStatus = async (ticket, updatedTicketData, transaction) => {
  if (ticket.status === "Unapproved") {
    updatedTicketData.confirmation_date = new Date();
    console.log(
      `Ticket ${ticket.ticket_code} confirmed at ${updatedTicketData.start_date}`,
    );
  }
  console.log(`Ticket ${ticket.ticket_code} declined`);
};

export const statusHandlers = {
  "In Queue": handleInQueueStatus,
  Ongoing: handleOngoingStatus,
  Resolved: handleResolvedStatus,
  "On hold": handleOnHoldStatus,
  Unapproved: handleUnapprovedStatus,
  Declined: handleDeclinedStatus,
};
