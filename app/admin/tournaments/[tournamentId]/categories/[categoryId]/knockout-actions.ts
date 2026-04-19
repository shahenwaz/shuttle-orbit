"use server";

import { revalidatePath } from "next/cache";

import { saveCategoryKnockoutConfig } from "@/lib/tournament-category/knockout-config";
import type { KnockoutStageType } from "@/lib/knockout/types";

export async function saveKnockoutStageSelection(args: {
  tournamentId: string;
  categoryId: string;
  startStageType: KnockoutStageType;
}) {
  const { tournamentId, categoryId, startStageType } = args;

  await saveCategoryKnockoutConfig({
    categoryId,
    startStageType,
  });

  revalidatePath(`/admin/tournaments/${tournamentId}/categories/${categoryId}`);
}
