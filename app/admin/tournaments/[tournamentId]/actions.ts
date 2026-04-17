"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { createTournamentCategorySchema } from "@/lib/validations/category";
import {
  updateTournamentSchema,
  type UpdateTournamentInput,
} from "@/lib/validations/tournament";

export type CreateTournamentCategoryActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    tournamentId?: string[];
    name?: string[];
    code?: string[];
    rulesSummary?: string[];
  };
};

export type UpdateTournamentActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof UpdateTournamentInput, string[]>>;
};

function toUtcMidday(dateString: string) {
  return new Date(`${dateString}T12:00:00.000Z`);
}

export async function createTournamentCategoryAction(
  _prevState: CreateTournamentCategoryActionState,
  formData: FormData,
): Promise<CreateTournamentCategoryActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    name: formData.get("name"),
    code: formData.get("code"),
    rulesSummary: formData.get("rulesSummary"),
  };

  const parsed = createTournamentCategorySchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, name, code, rulesSummary } = parsed.data;
  const normalizedCode = code.toUpperCase();

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { id: true, slug: true },
  });

  if (!tournament) {
    return {
      success: false,
      message: "Tournament was not found.",
    };
  }

  const existingCategory = await prisma.tournamentCategory.findFirst({
    where: {
      tournamentId,
      code: normalizedCode,
    },
    select: { id: true },
  });

  if (existingCategory) {
    return {
      success: false,
      message: "This category code already exists in the tournament.",
      fieldErrors: {
        code: ["Use a different category code for this tournament."],
      },
    };
  }

  await prisma.tournamentCategory.create({
    data: {
      tournamentId,
      name,
      code: normalizedCode,
      rulesSummary: rulesSummary || null,
      status: "draft",
    },
  });

  revalidatePath(`/admin/tournaments/${tournamentId}`);
  revalidatePath("/admin/tournaments");
  revalidatePath("/admin");
  revalidatePath(`/tournaments/${tournament.slug}`);
  revalidatePath("/tournaments");
  revalidatePath("/");

  return {
    success: true,
    message: "Category created successfully.",
    fieldErrors: {},
  };
}

export async function updateTournamentAction(
  _prevState: UpdateTournamentActionState,
  formData: FormData,
): Promise<UpdateTournamentActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    name: formData.get("name"),
    location: formData.get("location"),
    eventDate: formData.get("eventDate"),
    status: formData.get("status"),
    description: formData.get("description"),
  };

  const parsed = updateTournamentSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, name, location, eventDate, status, description } =
    parsed.data;

  const existingTournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { id: true, slug: true },
  });

  if (!existingTournament) {
    return {
      success: false,
      message: "Tournament not found.",
    };
  }

  await prisma.tournament.update({
    where: {
      id: tournamentId,
    },
    data: {
      name,
      location: location || null,
      eventDate: toUtcMidday(eventDate),
      status,
      description: description || null,
    },
  });

  revalidatePath(`/admin/tournaments/${tournamentId}`);
  revalidatePath("/admin/tournaments");
  revalidatePath("/admin");
  revalidatePath(`/tournaments/${existingTournament.slug}`);
  revalidatePath("/tournaments");
  revalidatePath("/");

  return {
    success: true,
    message: "Tournament updated successfully.",
    fieldErrors: {},
  };
}
