"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { createTeamEntrySchema } from "@/lib/validations/team-entry";

export type CreateTeamEntryActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    tournamentId?: string[];
    categoryId?: string[];
    player1Id?: string[];
    player2Id?: string[];
    teamName?: string[];
  };
};

export async function createTeamEntryAction(
  _prevState: CreateTeamEntryActionState,
  formData: FormData,
): Promise<CreateTeamEntryActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    player1Id: formData.get("player1Id"),
    player2Id: formData.get("player2Id"),
    teamName: formData.get("teamName"),
  };

  const parsed = createTeamEntrySchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, categoryId, player1Id, player2Id, teamName } =
    parsed.data;

  const category = await prisma.tournamentCategory.findFirst({
    where: {
      id: categoryId,
      tournamentId,
    },
    include: {
      tournament: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Tournament category was not found.",
    };
  }

  const existingTeamWithEitherPlayer = await prisma.teamEntry.findFirst({
    where: {
      tournamentId,
      categoryId,
      OR: [
        { player1Id },
        { player2Id },
        { player1Id: player2Id },
        { player2Id: player1Id },
      ],
    },
    select: {
      id: true,
    },
  });

  if (existingTeamWithEitherPlayer) {
    return {
      success: false,
      message:
        "One or both selected players are already assigned in this category.",
      fieldErrors: {
        player1Id: ["Each player can only appear once in the same category."],
        player2Id: ["Each player can only appear once in the same category."],
      },
    };
  }

  const duplicatePair = await prisma.teamEntry.findFirst({
    where: {
      tournamentId,
      categoryId,
      OR: [
        {
          player1Id,
          player2Id,
        },
        {
          player1Id: player2Id,
          player2Id: player1Id,
        },
      ],
    },
    select: {
      id: true,
    },
  });

  if (duplicatePair) {
    return {
      success: false,
      message: "This team pairing already exists in the category.",
    };
  }

  await prisma.teamEntry.create({
    data: {
      tournamentId,
      categoryId,
      player1Id,
      player2Id,
      teamName: teamName || null,
      status: "registered",
    },
  });

  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/teams`,
  );
  revalidatePath(`/admin/tournaments/${tournamentId}`);
  revalidatePath(`/admin/tournaments`);
  revalidatePath(`/tournaments`);

  return {
    success: true,
    message: "Team created successfully.",
    fieldErrors: {},
  };
}
