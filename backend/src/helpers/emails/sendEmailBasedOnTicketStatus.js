import getBaseURL from "../getBaseURL.js";
import { sendEmail } from "./sendEmail.js";
import ticketApprovedEmailTemplate from "./templates/ticketApprovedEmailTemplate.js";
import ticketResolvedEmailTemplate from "./templates/ticketResolvedEmailTemplate.js";

const sendInQueueEmail = async (ticket) => {
  try {
    // send email
    if (ticket.client?.email) {
      await sendEmail({
        to: ticket.client?.email,
        subject: `[${ticket.ticket_code}] SDO Ticket Request has been approved!`,
        html: ticketApprovedEmailTemplate({
          customerName: ticket.client?.first_name || "there",
          ticketCode: ticket.ticket_code,
          serviceName: ticket.service?.name || "N/A",
          departmentName: ticket.service?.department?.name || "N/A",
          scheduledDate: ticket.scheduled_date || "N/A",
        }),
      });
    }
    console.log(`Ticket ${ticket.ticket_code} email sent (In Queue)`);
  } catch (emailError) {
    console.error("Ticket created but email failed:", emailError);
  }
};

const sendOngoingEmail = async (ticket) => {
  console.log(`Ticket ${ticket.ticket_code} email sent (Ongoing)`);
};

const sendResolvedEmail = async (ticket) => {
  try {
    // send email
    if (ticket.client?.email) {
      await sendEmail({
        to: ticket.client?.email,
        subject: `[${ticket.ticket_code}] SDO Ticket Request has been resolved!`,
        html: ticketResolvedEmailTemplate({
          customerName: ticket.client?.first_name || "there",
          ticketCode: ticket.ticket_code,
          serviceName: ticket.service?.name || "N/A",
          surveyLink: `${getBaseURL()}/ticket/survey/${ticket.id}`,
        }),
      });
    }
    console.log(`Ticket ${ticket.ticket_code} email sent (Resolved)`);
  } catch (emailError) {
    console.error("Ticket created but email failed:", emailError);
  }
};

const sendOnHoldEmail = async (ticket) => {
  console.log(`Ticket ${ticket.ticket_code} email sent (On Hold)`);
};

const sendUnapprovedEmail = async (ticket) => {
  console.log(`Ticket ${ticket.ticket_code} email sent (Unapproved)`);
};

const sendDeclinedEmail = async (ticket) => {
  console.log(`Ticket ${ticket.ticket_code} email sent (Declined)`);
};

export const sendEmailBasedOnTicketStatus = {
  "In Queue": sendInQueueEmail,
  Ongoing: sendOngoingEmail,
  Resolved: sendResolvedEmail,
  "On hold": sendOnHoldEmail,
  Unapproved: sendUnapprovedEmail,
  Declined: sendDeclinedEmail,
};
