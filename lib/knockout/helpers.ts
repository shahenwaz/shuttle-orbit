import {
  getKnockoutMatchSlots,
  getKnockoutStageDefinition,
} from "@/lib/knockout/config";
import type {
  KnockoutAdvanceTarget,
  KnockoutConsolationTarget,
  KnockoutStageSeed,
  KnockoutStageType,
} from "@/lib/knockout/types";

export function getKnockoutStageChain(
  startingStageType: KnockoutStageType,
): KnockoutStageType[] {
  const chain: KnockoutStageType[] = [];
  let currentStageType: KnockoutStageType | null = startingStageType;

  while (currentStageType && currentStageType !== "third_place") {
    chain.push(currentStageType);
    currentStageType =
      getKnockoutStageDefinition(currentStageType).nextStageType;
  }

  return chain;
}

export function buildKnockoutStageSeeds(
  startingStageType: KnockoutStageType,
): KnockoutStageSeed[] {
  const mainStages = getKnockoutStageChain(startingStageType).map(
    (stageType) => {
      const definition = getKnockoutStageDefinition(stageType);

      return {
        stageType,
        stageName: definition.label,
        matches: getKnockoutMatchSlots(stageType),
      };
    },
  );

  const includesSemiFinal = mainStages.some(
    (stage) => stage.stageType === "semi_final",
  );

  if (includesSemiFinal) {
    mainStages.push({
      stageType: "third_place",
      stageName: getKnockoutStageDefinition("third_place").label,
      matches: getKnockoutMatchSlots("third_place"),
    });
  }

  return mainStages;
}

export function getAdvanceTarget(
  stageType: KnockoutStageType,
  matchNumber: number,
): KnockoutAdvanceTarget {
  if (stageType === "quarter_final") {
    if (matchNumber === 1) {
      return {
        nextStageType: "semi_final",
        nextMatchNumber: 1,
        nextSlot: "teamAId",
      };
    }

    if (matchNumber === 2) {
      return {
        nextStageType: "semi_final",
        nextMatchNumber: 1,
        nextSlot: "teamBId",
      };
    }

    if (matchNumber === 3) {
      return {
        nextStageType: "semi_final",
        nextMatchNumber: 2,
        nextSlot: "teamAId",
      };
    }

    if (matchNumber === 4) {
      return {
        nextStageType: "semi_final",
        nextMatchNumber: 2,
        nextSlot: "teamBId",
      };
    }
  }

  if (stageType === "semi_final") {
    if (matchNumber === 1) {
      return {
        nextStageType: "final",
        nextMatchNumber: 1,
        nextSlot: "teamAId",
      };
    }

    if (matchNumber === 2) {
      return {
        nextStageType: "final",
        nextMatchNumber: 1,
        nextSlot: "teamBId",
      };
    }
  }

  return null;
}

export function getConsolationTarget(
  stageType: KnockoutStageType,
  matchNumber: number,
): KnockoutConsolationTarget {
  if (stageType === "semi_final") {
    if (matchNumber === 1) {
      return {
        nextStageType: "third_place",
        nextMatchNumber: 1,
        nextSlot: "teamAId",
      };
    }

    if (matchNumber === 2) {
      return {
        nextStageType: "third_place",
        nextMatchNumber: 1,
        nextSlot: "teamBId",
      };
    }
  }

  return null;
}

export function getKnockoutRoundLabel(
  stageType: KnockoutStageType,
  matchNumber: number,
) {
  switch (stageType) {
    case "quarter_final":
      return `Quarter Final ${matchNumber}`;
    case "semi_final":
      return `Semi Final ${matchNumber}`;
    case "final":
      return "Final";
    case "third_place":
      return "Third Place";
  }
}
