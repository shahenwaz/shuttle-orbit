import { z } from "zod";

export const createTeamEntrySchema = z
  .object({
    tournamentId: z.string().cuid("Invalid tournament id."),
    categoryId: z.string().cuid("Invalid category id."),
    player1Id: z.string().cuid("Select a valid first player."),
    player2Id: z.string().cuid("Select a valid second player."),
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

export type CreateTeamEntryInput = z.infer<typeof createTeamEntrySchema>;
