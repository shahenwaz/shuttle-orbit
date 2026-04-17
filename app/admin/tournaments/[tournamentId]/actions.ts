"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/slug";
import {
  createTournamentSchema,
  type CreateTournamentInput,
} from "@/lib/validations/tournament";

export type CreateTournamentActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof CreateTournamentInput, string[]>>;
};

function toUtcMidday(dateString: string) {
  return new Date(`${dateString}T12:00:00.000Z`);
}

async function generateUniqueTournamentSlug(name: string) {
  const baseSlug = slugify(name);
  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.tournament.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function createTournamentAction(
  _prevState: CreateTournamentActionState,
  formData: FormData,
): Promise<CreateTournamentActionState> {
  const rawValues = {
    name: formData.get("name"),
    location: formData.get("location"),
    eventDate: formData.get("eventDate"),
    status: formData.get("status"),
    description: formData.get("description"),
  };

  const parsed = createTournamentSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, location, eventDate, status, description } = parsed.data;

  const slug = await generateUniqueTournamentSlug(name);

  await prisma.tournament.create({
    data: {
      name,
      slug,
      location: location || null,
      eventDate: toUtcMidday(eventDate),
      status,
      description: description || null,
    },
  });

  revalidatePath("/admin/tournaments");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/tournaments");

  return {
    success: true,
    message: "Tournament created successfully.",
    fieldErrors: {},
  };
}
