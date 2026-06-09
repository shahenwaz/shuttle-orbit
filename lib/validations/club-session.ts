import { z } from "zod";

const optionalText = (max: number, message: string) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return undefined;

    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : undefined;
  }, z.string().max(max, message).optional());

export const clubSessionFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Session title must be at least 2 characters.")
      .max(100, "Session title must be 100 characters or less."),
    sessionDate: z.string().min(1, "Session date is required."),
    startTime: z.string().min(1, "Start time is required."),
    endTime: z.string().min(1, "End time is required."),
    venue: optionalText(160, "Venue must be 160 characters or less."),
    courtNumbers: optionalText(
      80,
      "Court numbers must be 80 characters or less.",
    ),
    bookingRef: optionalText(
      80,
      "Booking reference must be 80 characters or less.",
    ),
    privateNotes: optionalText(500, "Notes must be 500 characters or less."),
  })
  .superRefine((data, ctx) => {
    const start = `${data.sessionDate}T${data.startTime}`;
    const end = `${data.sessionDate}T${data.endTime}`;

    if (end <= start) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    }
  });

export type ClubSessionFormInput = z.infer<typeof clubSessionFormSchema>;
