import * as z from "zod";

export const userNameSchema = z.object({
  name: z.string().min(3).max(32)
});

export const userMobileSchema = z.object({
  phone: z.string().min(1, "Phone is required")
});
