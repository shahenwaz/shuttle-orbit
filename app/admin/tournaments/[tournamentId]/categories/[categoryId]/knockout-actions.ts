"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import {
  buildKnockoutStageSeeds,
  getKnockoutRoundLabel,
} from "@/lib/knockout/helpers";
import type { KnockoutStageType } from "@/lib/knockout/types";
import { saveCategoryKnockoutConfig } from "@/lib/tournament-category/knockout-config";

export async function saveKnockoutStageSelection(args: {
  tournamentId: string;
  categoryId: string;
  startStageType: KnockoutStageType;
  includeThirdPlace?: boolean;
}) {
  await requireAdmin();

  const {
    tournamentId,
    categoryId,
    startStageType,
    includeThirdPlace = true,
  } = args;

  await saveCategoryKnockoutConfig({
    categoryId,
    startStageType,
    includeThirdPlace,
  });

  revalidatePath(`/admin/tournaments/${tournamentId}/categories/${categoryId}`);
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`,
  );
}

function shouldIncludeThirdPlace(config: unknown) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return false;
  }

  return (config as { includeThirdPlace?: unknown }).includeThirdPlace === true;
}

export async function generateKnockoutBracketAction(args: {
  tournamentId: string;
  categoryId: string;
}) {
  await requireAdmin();

  const { tournamentId, categoryId } = args;

  const category = await prisma.tournamentCategory.findFirst({
    where: {
      id: categoryId,
      tournamentId,
    },
    include: {
      stages: {
        orderBy: {
          stageOrder: "asc",
        },
        select: {
          id: true,
          stageType: true,
          stageOrder: true,
        },
      },
    },
  });

  if (!category || !category.knockoutStartStage) {
    throw new Error("Knockout stage configuration not found.");
  }

  const startStageType = category.knockoutStartStage as KnockoutStageType;
  const seeds = buildKnockoutStageSeeds(startStageType, {
    includeThirdPlace: shouldIncludeThirdPlace(category.knockoutConfig),
  });

  type CategoryStage = (typeof category.stages)[number];
  type KnockoutSeed = (typeof seeds)[number];
  type KnockoutMatchSeed = KnockoutSeed["matches"][number];

  const maxStageOrder =
    category.stages.reduce(
      (max: number, stage: CategoryStage) => Math.max(max, stage.stageOrder),
      0,
    ) || 0;

  let nextStageOrder = maxStageOrder + 1;

  for (const seed of seeds as KnockoutSeed[]) {
    let stage = await prisma.stage.findFirst({
      where: {
        categoryId,
        stageType: seed.stageType,
      },
      select: {
        id: true,
      },
    });

    if (!stage) {
      stage = await prisma.stage.create({
        data: {
          categoryId,
          name: seed.stageName,
          stageType: seed.stageType,
          stageOrder: nextStageOrder,
        },
        select: {
          id: true,
        },
      });

      nextStageOrder += 1;
    }

    const existingMatches = await prisma.match.count({
      where: {
        tournamentId,
        categoryId,
        stageId: stage.id,
        groupId: null,
      },
    });

    if (existingMatches === 0) {
      await prisma.match.createMany({
        data: (seed.matches as KnockoutMatchSeed[]).map(
          (matchSeed: KnockoutMatchSeed) => ({
            tournamentId,
            categoryId,
            stageId: stage.id,
            groupId: null,
            roundLabel: getKnockoutRoundLabel(
              seed.stageType,
              matchSeed.matchNumber,
            ),
            teamAId: null,
            teamBId: null,
            status: "scheduled",
          }),
        ),
      });
    }
  }

  revalidatePath(`/admin/tournaments/${tournamentId}/categories/${categoryId}`);
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/results`,
  );
}

export async function assignKnockoutMatchTeamsAction(args: {
  tournamentId: string;
  categoryId: string;
  matchId: string;
  teamAId: string | null;
  teamBId: string | null;
}) {
  await requireAdmin();

  const { tournamentId, categoryId, matchId, teamAId, teamBId } = args;

  if (teamAId && teamBId && teamAId === teamBId) {
    throw new Error("Choose two different teams.");
  }

  await prisma.$transaction(async (tx) => {
    const match = await tx.match.findFirst({
      where: {
        id: matchId,
        tournamentId,
        categoryId,
        groupId: null,
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
      throw new Error("Knockout match not found.");
    }

    const hasRecordedResult =
      match.status === "completed" ||
      match.winnerId !== null ||
      match.scoreSummary !== null ||
      match.sets.length > 0;

    if (hasRecordedResult) {
      throw new Error(
        "Reset this knockout match result before assigning teams.",
      );
    }

    const selectedTeamIds = [teamAId, teamBId].filter(
      (teamId): teamId is string => teamId !== null,
    );

    if (selectedTeamIds.length > 0) {
      const validTeamCount = await tx.teamEntry.count({
        where: {
          id: {
            in: selectedTeamIds,
          },
          tournamentId,
          categoryId,
        },
      });

      if (validTeamCount !== selectedTeamIds.length) {
        throw new Error(
          "Selected teams must belong to this tournament category.",
        );
      }
    }

    await tx.match.update({
      where: {
        id: match.id,
      },
      data: {
        teamAId,
        teamBId,
        winnerId: null,
        scoreSummary: null,
        status: "scheduled",
      },
    });

    await tx.matchSet.deleteMany({
      where: {
        matchId: match.id,
      },
    });
  });

  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/results`,
  );
}

export async function resetKnockoutMatchTeamsAction(args: {
  tournamentId: string;
  categoryId: string;
  matchId: string;
}) {
  await requireAdmin();

  const { tournamentId, categoryId, matchId } = args;

  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      tournamentId,
      categoryId,
      groupId: null,
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
    throw new Error("Knockout match not found.");
  }

  const hasRecordedResult =
    match.status === "completed" ||
    match.winnerId !== null ||
    match.scoreSummary !== null ||
    match.sets.length > 0;

  if (hasRecordedResult) {
    throw new Error("Teams cannot be reset after a score has been recorded.");
  }

  await prisma.match.update({
    where: {
      id: matchId,
    },
    data: {
      teamAId: null,
      teamBId: null,
      winnerId: null,
      scoreSummary: null,
      status: "scheduled",
    },
  });

  await prisma.matchSet.deleteMany({
    where: {
      matchId,
    },
  });

  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/results`,
  );
}
