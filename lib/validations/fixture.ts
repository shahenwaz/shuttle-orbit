import { z } from "zod";

export const generateGroupFixturesSchema = z.object({
  tournamentId: z.cuid("Invalid tournament id."),
  categoryId: z.cuid("Invalid category id."),
  groupId: z.cuid({ error: "Invalid group id." }),
});

export type GenerateGroupFixturesInput = z.infer<
  typeof generateGroupFixturesSchema
>;
