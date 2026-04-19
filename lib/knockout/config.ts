import type {
  KnockoutMatchSlot,
  KnockoutStageDefinition,
  KnockoutStageType,
} from "@/lib/knockout/types";

export const KNOCKOUT_STAGE_DEFINITIONS: Record<
  KnockoutStageType,
  KnockoutStageDefinition
> = {
  quarter_final: {
    type: "quarter_final",
    label: "Quarter Final",
    teamSlots: 8,
    matchCount: 4,
    nextStageType: "semi_final",
  },
  semi_final: {
    type: "semi_final",
    label: "Semi Final",
    teamSlots: 4,
    matchCount: 2,
    nextStageType: "final",
  },
  final: {
    type: "final",
    label: "Final",
    teamSlots: 2,
    matchCount: 1,
    nextStageType: null,
  },
};

export function getKnockoutStageDefinition(stageType: KnockoutStageType) {
  return KNOCKOUT_STAGE_DEFINITIONS[stageType];
}

export function getKnockoutMatchSlots(
  stageType: KnockoutStageType,
): KnockoutMatchSlot[] {
  switch (stageType) {
    case "quarter_final":
      return [
        { matchNumber: 1, slotA: "QF1-A", slotB: "QF1-B" },
        { matchNumber: 2, slotA: "QF2-A", slotB: "QF2-B" },
        { matchNumber: 3, slotA: "QF3-A", slotB: "QF3-B" },
        { matchNumber: 4, slotA: "QF4-A", slotB: "QF4-B" },
      ];

    case "semi_final":
      return [
        { matchNumber: 1, slotA: "SF1-A", slotB: "SF1-B" },
        { matchNumber: 2, slotA: "SF2-A", slotB: "SF2-B" },
      ];

    case "final":
      return [{ matchNumber: 1, slotA: "F-A", slotB: "F-B" }];
  }
}
