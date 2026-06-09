import { z } from "zod";

const optionalText = (max: number, message: string) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return undefined;

    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : undefined;
  }, z.string().max(max, message).optional());

export const clubFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Club name must be at least 2 characters.")
    .max(100, "Club name must be 100 characters or less."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Slug must be at least 3 characters.")
    .max(80, "Slug must be 80 characters or less.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only use lowercase letters, numbers, and hyphens.",
    ),
  shortName: optionalText(24, "Short name must be 24 characters or less."),
  description: optionalText(600, "Description must be 600 characters or less."),
  homeVenue: optionalText(160, "Home venue must be 160 characters or less."),
  logoUrl: optionalText(300, "Logo URL must be 300 characters or less."),
  bannerUrl: optionalText(300, "Banner URL must be 300 characters or less."),
  isPublic: z.preprocess(
    (value) => value === "on" || value === "true",
    z.boolean(),
  ),
});

export type ClubFormInput = z.infer<typeof clubFormSchema>;
