"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import {
  createTournamentCategorySchema,
  updateTournamentCategorySchema,
  type UpdateTournamentCategoryInput,
} from "@/lib/validations/category";
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

export type UpdateTournamentCategoryActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof UpdateTournamentCategoryInput, string[]>>;
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

  const { tournamentId, name, location, eventDate, description } = parsed.data;

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

export async function updateTournamentCategoryAction(
  _prevState: UpdateTournamentCategoryActionState,
  formData: FormData,
): Promise<UpdateTournamentCategoryActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    code: formData.get("code"),
    rulesSummary: formData.get("rulesSummary"),
  };

  const parsed = updateTournamentCategorySchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, categoryId, name, code, rulesSummary } = parsed.data;
  const normalizedCode = code.toUpperCase();

  const category = await prisma.tournamentCategory.findFirst({
    where: {
      id: categoryId,
      tournamentId,
    },
    include: {
      tournament: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Category not found.",
    };
  }

  const existingCategoryWithCode = await prisma.tournamentCategory.findFirst({
    where: {
      tournamentId,
      code: normalizedCode,
      NOT: {
        id: categoryId,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingCategoryWithCode) {
    return {
      success: false,
      message: "This category code already exists in the tournament.",
      fieldErrors: {
        code: ["Use a different category code for this tournament."],
      },
    };
  }

  await prisma.tournamentCategory.update({
    where: {
      id: categoryId,
    },
    data: {
      name,
      code: normalizedCode,
      rulesSummary: rulesSummary || null,
    },
  });

  revalidatePath(`/admin/tournaments/${tournamentId}`);
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/teams`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/groups`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/results`,
  );
  revalidatePath(`/tournaments/${category.tournament.slug}`);
  revalidatePath("/tournaments");
  revalidatePath("/");

  return {
    success: true,
    message: "Category updated successfully.",
    fieldErrors: {},
  };
}
