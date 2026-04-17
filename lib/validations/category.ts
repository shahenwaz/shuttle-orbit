import { z } from "zod";

export const createTournamentCategorySchema = z.object({
  tournamentId: z.cuid({ error: "Invalid tournament id." }),
  name: z
    .string()
    .trim()
    .min(1, "Category name is required.")
    .max(80, "Category name must be 80 characters or less."),
  code: z
    .string()
    .trim()
    .min(1, "Category code is required.")
    .max(20, "Category code must be 20 characters or less.")
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Category code can only contain letters, numbers, hyphen, and underscore.",
    ),
  rulesSummary: z
    .string()
    .trim()
    .max(300, "Rules summary must be 300 characters or less.")
    .optional()
    .or(z.literal("")),
});
