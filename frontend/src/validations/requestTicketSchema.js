import * as z from "zod";

export const requestTicketSchema = z.object({
  department_id: z.uuid("Invalid department"),
  service_id: z.uuid("Invalid service"),
  details: z.string().max(255, "No more than 255 characters"),
  date: z.date("Invalid date"),
});
