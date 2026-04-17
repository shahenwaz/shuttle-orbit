import { z } from "zod";

export const createTeamEntrySchema = z
  .object({
    tournamentId: z.cuid({ error: "Invalid tournament id." }),
    categoryId: z.cuid({ error: "Invalid category id." }),
    player1Id: z.cuid({ error: "Select a valid first player." }),
    player2Id: z.cuid({ error: "Select a valid second player." }),
    teamName: z
      .string()
      .trim()
      .max(80, "Team name must be 80 characters or less.")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.player1Id === data.player2Id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["player2Id"],
        message: "Choose two different players.",
      });
    }
  });
