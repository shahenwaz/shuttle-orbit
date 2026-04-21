"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export type RemoveTeamEntryActionState = {
  success: boolean;
  message: string;
};

const removeTeamEntrySchema = z.object({
  tournamentId: z.cuid({ error: "Invalid tournament id." }),
  categoryId: z.cuid({ error: "Invalid category id." }),
  teamEntryId: z.cuid({ error: "Invalid team entry id." }),
});

function revalidateTeamPaths(tournamentId: string, categoryId: string) {
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
}

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
    select: {
      id: true,
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
        { player1Id, player2Id },
        { player1Id: player2Id, player2Id: player1Id },
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

  revalidateTeamPaths(tournamentId, categoryId);

  return {
    success: true,
    message: "Team created successfully.",
    fieldErrors: {},
  };
}

export async function removeTeamEntryAction(
  formData: FormData,
): Promise<RemoveTeamEntryActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    teamEntryId: formData.get("teamEntryId"),
  };

  const parsed = removeTeamEntrySchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid team removal request.",
    };
  }

  const { tournamentId, categoryId, teamEntryId } = parsed.data;

  const teamEntry = await prisma.teamEntry.findFirst({
    where: {
      id: teamEntryId,
      tournamentId,
      categoryId,
    },
    select: {
      id: true,
    },
  });

  if (!teamEntry) {
    return {
      success: false,
      message: "Team entry not found.",
    };
  }

  const groupMembershipCount = await prisma.groupMembership.count({
    where: {
      teamEntryId,
    },
  });

  if (groupMembershipCount > 0) {
    return {
      success: false,
      message: "This team is already assigned to a group. Unassign it first.",
    };
  }

  const matchUsageCount = await prisma.match.count({
    where: {
      OR: [{ teamAId: teamEntryId }, { teamBId: teamEntryId }],
    },
  });

  if (matchUsageCount > 0) {
    return {
      success: false,
      message:
        "This team cannot be removed because fixtures or results already exist for it.",
    };
  }

  try {
    await prisma.teamEntry.delete({
      where: {
        id: teamEntryId,
      },
    });
  } catch {
    return {
      success: false,
      message:
        "This team cannot be removed because it is linked to tournament records.",
    };
  }

  revalidateTeamPaths(tournamentId, categoryId);

  return {
    success: true,
    message: "Team removed successfully.",
  };
}
