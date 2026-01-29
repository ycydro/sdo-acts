import { sendEmail } from "./sendEmail.js";
import ticketApprovedEmailTemplate from "./templates/ticketApprovedEmailTemplate.js";

const sendInQueueEmail = async (ticket) => {
  try {
    // send email
    if (ticket.client?.email) {
      await sendEmail({
        to: ticket.client?.email,
        subject: "Your SDO ticket request has been approved!",
        html: ticketApprovedEmailTemplate({
          customerName: ticket.client?.first_name || "there",
          ticketCode: ticket.ticket_code,
          serviceName: ticket.service?.name || "N/A",
          departmentName: ticket.service?.department?.name || "N/A",
          scheduledDate: ticket.scheduled_date || "N/A",
        }),
      });
    }
  } catch (emailError) {
    console.error("Ticket created but email failed:", emailError);
  }
  console.log(`Ticket ${ticket.ticket_code} email sent (In Queue)`);
};

const sendOngoingEmail = async (ticket) => {
  console.log(`Ticket ${ticket.ticket_code} email sent (Ongoing)`);
};

const sendResolvedEmail = async (ticket) => {
  console.log(`Ticket ${ticket.ticket_code} email sent (Resolved)`);
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
