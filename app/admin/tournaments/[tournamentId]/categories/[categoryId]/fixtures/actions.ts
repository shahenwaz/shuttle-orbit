"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { generateRoundRobinPairings } from "@/lib/tournament/fixtures";
import { generateGroupFixturesSchema } from "@/lib/validations/fixture";

export type GenerateGroupFixturesActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    tournamentId?: string[];
    categoryId?: string[];
    groupId?: string[];
  };
};

export type CreateGroupMatchActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    tournamentId?: string[];
    categoryId?: string[];
    groupId?: string[];
    teamAId?: string[];
    teamBId?: string[];
    roundLabel?: string[];
  };
};

const createGroupMatchSchema = z.object({
  tournamentId: z.cuid(),
  categoryId: z.cuid(),
  groupId: z.cuid(),
  teamAId: z.cuid(),
  teamBId: z.cuid(),
  roundLabel: z
    .string()
    .trim()
    .min(1, "Round label is required.")
    .max(80, "Round label is too long."),
});

function revalidateFixturePaths(tournamentId: string, categoryId: string) {
  revalidatePath(`/admin/tournaments/${tournamentId}`);
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/groups`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/results`,
  );
  revalidatePath(`/tournaments`);
}

export async function generateGroupFixturesAction(
  _prevState: GenerateGroupFixturesActionState,
  formData: FormData,
): Promise<GenerateGroupFixturesActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    groupId: formData.get("groupId"),
  };

  const parsed = generateGroupFixturesSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, categoryId, groupId } = parsed.data;

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      stage: {
        select: {
          id: true,
          categoryId: true,
          stageOrder: true,
          stageType: true,
        },
      },
      memberships: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          teamEntry: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!group || group.stage.categoryId !== categoryId) {
    return {
      success: false,
      message: "Selected group was not found for this category.",
    };
  }

  if (group.memberships.length < 2) {
    return {
      success: false,
      message: "At least 2 teams are required to generate fixtures.",
    };
  }

  const teamEntries = group.memberships.map((membership) => ({
    id: membership.teamEntry.id,
  }));

  const pairings = generateRoundRobinPairings(teamEntries);

  if (pairings.length === 0) {
    return {
      success: false,
      message: "No valid fixtures could be generated for this group.",
    };
  }

  const existingMatches = await prisma.match.findMany({
    where: {
      tournamentId,
      categoryId,
      stageId: group.stage.id,
      groupId,
    },
    select: {
      teamAId: true,
      teamBId: true,
    },
  });

  const existingMatchKeys = new Set(
    existingMatches.map((match) =>
      [match.teamAId, match.teamBId].sort().join("::"),
    ),
  );

  const newPairings = pairings.filter((pairing) => {
    const key = [pairing.teamAId, pairing.teamBId].sort().join("::");
    return !existingMatchKeys.has(key);
  });

  if (newPairings.length === 0) {
    return {
      success: false,
      message: "All round robin fixtures for this group already exist.",
    };
  }

  await prisma.$transaction(
    newPairings.map((pairing) =>
      prisma.match.create({
        data: {
          tournamentId,
          categoryId,
          stageId: group.stage.id,
          groupId,
          roundLabel: pairing.roundLabel,
          teamAId: pairing.teamAId,
          teamBId: pairing.teamBId,
          status: "scheduled",
        },
      }),
    ),
  );

  revalidateFixturePaths(tournamentId, categoryId);

  return {
    success: true,
    message: `${newPairings.length} fixture${newPairings.length === 1 ? "" : "s"} generated successfully.`,
    fieldErrors: {},
  };
}

export async function createGroupMatchAction(
  _prevState: CreateGroupMatchActionState,
  formData: FormData,
): Promise<CreateGroupMatchActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    groupId: formData.get("groupId"),
    teamAId: formData.get("teamAId"),
    teamBId: formData.get("teamBId"),
    roundLabel: formData.get("roundLabel"),
  };

  const parsed = createGroupMatchSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, categoryId, groupId, teamAId, teamBId, roundLabel } =
    parsed.data;

  if (teamAId === teamBId) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: {
        teamBId: ["Choose a different opponent team."],
      },
    };
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      stage: {
        select: {
          id: true,
          categoryId: true,
        },
      },
      memberships: {
        select: {
          teamEntryId: true,
        },
      },
    },
  });

  if (!group || group.stage.categoryId !== categoryId) {
    return {
      success: false,
      message: "Selected group was not found for this category.",
    };
  }

  const groupTeamIds = new Set(group.memberships.map((m) => m.teamEntryId));

  if (!groupTeamIds.has(teamAId) || !groupTeamIds.has(teamBId)) {
    return {
      success: false,
      message: "Selected teams must belong to this group.",
    };
  }

  await prisma.match.create({
    data: {
      tournamentId,
      categoryId,
      stageId: group.stage.id,
      groupId,
      roundLabel,
      teamAId,
      teamBId,
      status: "scheduled",
    },
  });

  revalidateFixturePaths(tournamentId, categoryId);

  return {
    success: true,
    message: "Match created successfully.",
    fieldErrors: {},
  };
}

// Note: We only allow deleting matches that have no recorded result to prevent accidental loss of important data.

export type DeleteMatchActionState = {
  success: boolean;
  message: string;
};

const deleteMatchSchema = z.object({
  tournamentId: z.cuid(),
  categoryId: z.cuid(),
  matchId: z.cuid(),
});

export async function deleteMatchAction(
  formData: FormData,
): Promise<DeleteMatchActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    matchId: formData.get("matchId"),
  };

  const parsed = deleteMatchSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid match removal request.",
    };
  }

  const { tournamentId, categoryId, matchId } = parsed.data;

  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      tournamentId,
      categoryId,
    },
    include: {
      sets: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!match) {
    return {
      success: false,
      message: "Match not found.",
    };
  }

  const hasRecordedResult =
    match.status === "completed" ||
    match.winnerId !== null ||
    match.scoreSummary !== null ||
    match.sets.length > 0;

  if (hasRecordedResult) {
    return {
      success: false,
      message:
        "This match already has a recorded result and cannot be removed.",
    };
  }

  await prisma.match.delete({
    where: {
      id: matchId,
    },
  });

  revalidateFixturePaths(tournamentId, categoryId);

  return {
    success: true,
    message: "Match removed successfully.",
  };
}
