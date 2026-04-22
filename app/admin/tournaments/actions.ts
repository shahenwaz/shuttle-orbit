"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export type DeleteCategoryActionState = {
  success: boolean;
  message: string;
};

const deleteCategorySchema = z.object({
  tournamentId: z.cuid(),
  categoryId: z.cuid(),
});

export async function deleteCategoryAction(
  formData: FormData,
): Promise<DeleteCategoryActionState> {
  const parsed = deleteCategorySchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid category deletion request.",
    };
  }

  const { tournamentId, categoryId } = parsed.data;

  const category = await prisma.tournamentCategory.findFirst({
    where: {
      id: categoryId,
      tournamentId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Category not found.",
    };
  }

  await prisma.tournamentCategory.delete({
    where: {
      id: categoryId,
    },
  });

  revalidatePath(`/admin/tournaments/${tournamentId}`);
  revalidatePath(`/admin/tournaments`);
  revalidatePath("/tournaments");
  revalidatePath("/");

  return {
    success: true,
    message: "Category deleted successfully.",
  };
}

export type DeleteTournamentActionState = {
  success: boolean;
  message: string;
};

const deleteTournamentSchema = z.object({
  tournamentId: z.cuid(),
});

export async function deleteTournamentAction(
  formData: FormData,
): Promise<DeleteTournamentActionState> {
  const parsed = deleteTournamentSchema.safeParse({
    tournamentId: formData.get("tournamentId"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid tournament deletion request.",
    };
  }

  const { tournamentId } = parsed.data;

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
    include: {
      _count: {
        select: {
          categories: true,
        },
      },
    },
  });

  if (!tournament) {
    return {
      success: false,
      message: "Tournament not found.",
    };
  }

  if (tournament._count.categories > 0) {
    return {
      success: false,
      message:
        "This tournament still has categories. Delete its categories first.",
    };
  }

  await prisma.tournament.delete({
    where: {
      id: tournamentId,
    },
  });

  revalidatePath(`/admin/tournaments`);
  revalidatePath("/admin");
  revalidatePath("/tournaments");
  revalidatePath("/");

  return {
    success: true,
    message: "Tournament deleted successfully.",
  };
}
