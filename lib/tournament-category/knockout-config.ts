import { prisma } from "@/lib/db/prisma";
import { buildKnockoutStageSeeds } from "@/lib/knockout/helpers";
import type { KnockoutStageType } from "@/lib/knockout/types";

export type StoredKnockoutConfig = {
  startStageType: KnockoutStageType;
  stages: Array<{
    stageType: KnockoutStageType;
    stageName: string;
    matches: Array<{
      matchNumber: number;
      slotA: string;
      slotB: string;
    }>;
  }>;
};

export async function saveCategoryKnockoutConfig(args: {
  categoryId: string;
  startStageType: KnockoutStageType;
}) {
  const config: StoredKnockoutConfig = {
    startStageType: args.startStageType,
    stages: buildKnockoutStageSeeds(args.startStageType),
  };

  return prisma.tournamentCategory.update({
    where: { id: args.categoryId },
    data: {
      knockoutStartStage: args.startStageType,
      knockoutConfig: config,
    },
    select: {
      id: true,
      code: true,
      name: true,
      knockoutStartStage: true,
      knockoutConfig: true,
    },
  });
}

export async function getCategoryKnockoutConfig(categoryId: string) {
  return prisma.tournamentCategory.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      code: true,
      name: true,
      knockoutStartStage: true,
      knockoutConfig: true,
    },
  });
}
