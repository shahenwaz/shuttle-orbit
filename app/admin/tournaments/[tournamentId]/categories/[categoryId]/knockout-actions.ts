"use server";

import { revalidatePath } from "next/cache";

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
}) {
  const { tournamentId, categoryId, startStageType } = args;

  await saveCategoryKnockoutConfig({
    categoryId,
    startStageType,
    includeThirdPlace: true,
  });

  revalidatePath(`/admin/tournaments/${tournamentId}/categories/${categoryId}`);
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`,
  );
}

export async function generateKnockoutBracketAction(args: {
  tournamentId: string;
  categoryId: string;
}) {
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
  const seeds = buildKnockoutStageSeeds(startStageType);
  const maxStageOrder =
    category.stages.reduce(
      (max, stage) => Math.max(max, stage.stageOrder),
      0,
    ) || 0;

  let nextStageOrder = maxStageOrder + 1;

  await prisma.$transaction(async (tx) => {
    for (const seed of seeds) {
      let stage = await tx.stage.findFirst({
        where: {
          categoryId,
          stageType: seed.stageType,
        },
        select: {
          id: true,
        },
      });

      if (!stage) {
        stage = await tx.stage.create({
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

      const existingMatches = await tx.match.count({
        where: {
          tournamentId,
          categoryId,
          stageId: stage.id,
          groupId: null,
        },
      });

      if (existingMatches === 0) {
        for (const matchSeed of seed.matches) {
          await tx.match.create({
            data: {
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
            },
          });
        }
      }
    }
  });

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
  const { tournamentId, categoryId, matchId, teamAId, teamBId } = args;

  if (teamAId && teamBId && teamAId === teamBId) {
    throw new Error("Choose two different teams.");
  }

  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      tournamentId,
      categoryId,
      groupId: null,
    },
    select: {
      id: true,
    },
  });

  if (!match) {
    throw new Error("Knockout match not found.");
  }

  await prisma.match.update({
    where: {
      id: matchId,
    },
    data: {
      teamAId,
      teamBId,
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

export async function resetKnockoutMatchTeamsAction(args: {
  tournamentId: string;
  categoryId: string;
  matchId: string;
}) {
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
