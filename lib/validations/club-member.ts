import { z } from "zod";

const optionalText = (max: number, message: string) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return undefined;

    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : undefined;
  }, z.string().max(max, message).optional());

const optionalId = z.preprocess((value) => {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().optional());

export const clubMemberFormSchema = z
  .object({
    playerId: optionalId,
    name: optionalText(100, "Member name must be 100 characters or less."),
    nickname: optionalText(40, "Nickname must be 40 characters or less."),
    role: z.enum(["OWNER", "ORGANIZER", "MEMBER"]),
    isPublic: z.preprocess(
      (value) => value === "on" || value === "true",
      z.boolean(),
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.playerId && !data.name) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Member name is required for club-only members.",
      });
    }
  });

export type ClubMemberFormInput = z.infer<typeof clubMemberFormSchema>;
