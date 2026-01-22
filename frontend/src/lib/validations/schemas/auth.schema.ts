import { z } from "zod";

export const registerSchema = z.object({
  company: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    size: z.string(),
    industry: z.string(),
    website: z.string().url().optional().or(z.literal("")),
  }),
  admin: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    password: z.string().min(8),
  }),
});

export type RegisterPayload = z.infer<typeof registerSchema>;
