import { z } from "zod";

export const createGroupSchema = z.object({
  tournamentId: z.string().cuid("Invalid tournament id."),
  categoryId: z.string().cuid("Invalid category id."),
  name: z
    .string()
    .trim()
    .min(1, "Group name is required.")
    .max(30, "Group name must be 30 characters or less."),
  groupOrder: z.coerce
    .number()
    .int("Group order must be a whole number.")
    .min(1, "Group order must be at least 1.")
    .max(100, "Group order is too large."),
});

export const assignTeamToGroupSchema = z.object({
  tournamentId: z.string().cuid("Invalid tournament id."),
  categoryId: z.string().cuid("Invalid category id."),
  groupId: z.string().cuid("Invalid group id."),
  teamEntryId: z.string().cuid("Invalid team entry id."),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type AssignTeamToGroupInput = z.infer<typeof assignTeamToGroupSchema>;
