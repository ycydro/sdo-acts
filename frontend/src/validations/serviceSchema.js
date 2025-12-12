import * as z from "zod";

export const serviceSchema = z
  .object({
    name: z.string().min(1, "Service name is required"),
    description: z.string().min(1, "Description is required"),
    classification: z.string().min(1, "Classification is required"),
    priority: z.string().min(1, "Priority is required"),
    department_id: z.uuid("Invalid department"),

    time_days: z.coerce.number().min(0).default(0),
    time_hours: z.coerce.number().min(0).max(23).default(0),
    time_minutes: z.coerce.number().min(0).max(59).default(0),
  })
  .refine(
    (data) =>
      data.time_days > 0 || data.time_hours > 0 || data.time_minutes > 0,
    {
      message: "At least one time field (days, hours, or minutes) is required",
      path: ["processing_time"], // show error below total processing time field
    }
  );
