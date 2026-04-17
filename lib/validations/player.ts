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
    .max(40, "Nickname must be 40 characters or less.")
    .optional()
    .or(z.literal("")),
  gender: z
    .string()
    .trim()
    .max(20, "Gender must be 20 characters or less.")
    .optional()
    .or(z.literal("")),
  communityTag: z
    .string()
    .trim()
    .max(50, "Community tag must be 50 characters or less.")
    .optional()
    .or(z.literal("")),
});

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
