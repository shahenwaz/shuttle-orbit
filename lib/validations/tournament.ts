import { z } from "zod";

export const tournamentStatusValues = [
  "draft",
  "upcoming",
  "published",
  "completed",
] as const;

export const createTournamentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Tournament name must be at least 3 characters.")
    .max(120, "Tournament name must be 120 characters or less."),
  location: z
    .string()
    .trim()
    .max(100, "Location must be 100 characters or less.")
    .optional()
    .or(z.literal("")),
  eventDate: z
    .string()
    .trim()
    .min(1, "Event date is required.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Event date is invalid.",
    }),
  status: z.enum(tournamentStatusValues),
  description: z
    .string()
    .trim()
    .max(400, "Description must be 400 characters or less.")
    .optional()
    .or(z.literal("")),
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
