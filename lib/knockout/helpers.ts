import {
  getKnockoutMatchSlots,
  getKnockoutStageDefinition,
} from "@/lib/knockout/config";
import type {
  KnockoutStageSeed,
  KnockoutStageType,
} from "@/lib/knockout/types";

export function getKnockoutStageChain(
  startingStageType: KnockoutStageType,
): KnockoutStageType[] {
  const chain: KnockoutStageType[] = [];
  let currentStageType: KnockoutStageType | null = startingStageType;

  while (currentStageType) {
    chain.push(currentStageType);
    currentStageType =
      getKnockoutStageDefinition(currentStageType).nextStageType;
  }

  return chain;
}

export function buildKnockoutStageSeeds(
  startingStageType: KnockoutStageType,
): KnockoutStageSeed[] {
  return getKnockoutStageChain(startingStageType).map((stageType) => {
    const definition = getKnockoutStageDefinition(stageType);

    return {
      stageType,
      stageName: definition.label,
      matches: getKnockoutMatchSlots(stageType),
    };
  });
}
