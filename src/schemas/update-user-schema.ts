import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.string(),
  phoneNumber: z.string(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
