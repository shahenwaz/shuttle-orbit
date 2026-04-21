import { prisma } from "@/lib/db/prisma";
import type { KnockoutStageType } from "@/lib/knockout/types";

type SaveCategoryKnockoutConfigArgs = {
  categoryId: string;
  startStageType: KnockoutStageType;
};

export async function saveCategoryKnockoutConfig({
  categoryId,
  startStageType,
}: SaveCategoryKnockoutConfigArgs) {
  return prisma.tournamentCategory.update({
    where: {
      id: categoryId,
    },
    data: {
      knockoutStartStage: startStageType,
      knockoutConfig: {
        startStageType,
      },
    },
    select: {
      id: true,
      knockoutStartStage: true,
      knockoutConfig: true,
    },
  });
}

export async function getCategoryKnockoutConfig(categoryId: string) {
  return prisma.tournamentCategory.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
      name: true,
      code: true,
      knockoutStartStage: true,
      knockoutConfig: true,
    },
  });
}
