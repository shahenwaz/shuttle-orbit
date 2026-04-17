import { z } from "zod";

export const recordMatchResultSchema = z
  .object({
    tournamentId: z.cuid({ error: "Invalid tournament id." }),
    categoryId: z.cuid({ error: "Invalid category id." }),
    matchId: z.cuid({ error: "Invalid match id." }),
    teamAScore: z.coerce
      .number()
      .int("Team A score must be a whole number.")
      .min(0, "Score cannot be negative.")
      .max(99, "Score is too large."),
    teamBScore: z.coerce
      .number()
      .int("Team B score must be a whole number.")
      .min(0, "Score cannot be negative.")
      .max(99, "Score is too large."),
  })
  .superRefine((data, ctx) => {
    if (data.teamAScore === data.teamBScore) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["teamBScore"],
        message: "A badminton match cannot end in a draw.",
      });
    }
  });

export type RecordMatchResultInput = z.infer<typeof recordMatchResultSchema>;
