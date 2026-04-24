import { z } from "zod";

export const createPlayerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(80, "Full name must be 80 characters or less."),
  nickname: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be 30 characters or less.")
    .regex(
      /^[a-z0-9._-]+$/,
      "Username can only contain lowercase letters, numbers, dot, underscore, and hyphen.",
    ),
});

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
