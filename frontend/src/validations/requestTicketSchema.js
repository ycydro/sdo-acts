import * as z from "zod";

export const requestTicketSchema = z.object({
  department_id: z.uuid("Invalid department"),
  service_id: z.uuid("Invalid service"),
  details: z.string().max(255, "No more than 255 characters"),
  classification: z.string().min(1, "Classification is required"),
  date: z.date("Invalid date"),
});
