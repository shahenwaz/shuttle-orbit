import { z } from "zod";

export const tournamentStatusValues = [
  "draft",
  "upcoming",
  "published",
  "completed",
] as const;

export const createTournamentSchema = z
  .object({
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
    startDate: z.string().trim().min(1, "Start date is required."),
    endDate: z.string().trim().optional().or(z.literal("")),
    status: z.enum(tournamentStatusValues),
    description: z
      .string()
      .trim()
      .max(400, "Description must be 400 characters or less.")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startDate);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Start date is invalid.",
      });
    }

    if (data.endDate) {
      const end = new Date(data.endDate);

      if (Number.isNaN(end.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date is invalid.",
        });
      } else if (!Number.isNaN(start.getTime()) && end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date cannot be before the start date.",
        });
      }
    }
  });

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
