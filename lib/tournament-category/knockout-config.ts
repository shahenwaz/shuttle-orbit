import { prisma } from "@/lib/db/prisma";
import type { KnockoutStageType } from "@/lib/knockout/types";

type SaveCategoryKnockoutConfigArgs = {
  categoryId: string;
  startStageType: KnockoutStageType;
  includeThirdPlace: boolean;
};

export async function saveCategoryKnockoutConfig({
  categoryId,
  startStageType,
  includeThirdPlace,
}: SaveCategoryKnockoutConfigArgs) {
  return prisma.tournamentCategory.update({
    where: {
      id: categoryId,
    },
    data: {
      knockoutStartStage: startStageType,
      knockoutConfig: {
        startStageType,
        includeThirdPlace,
      },
    },
    select: {
      id: true,
      knockoutStartStage: true,
      knockoutConfig: true,
    },
  });
}

export async function getCategoryKnockoutConfig(
  categoryId: string,
  tournamentId: string,
) {
  return prisma.tournamentCategory.findFirst({
    where: {
      id: categoryId,
      tournamentId,
    },
    select: {
      id: true,
      name: true,
      code: true,
      knockoutStartStage: true,
      knockoutConfig: true,
      tournament: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
