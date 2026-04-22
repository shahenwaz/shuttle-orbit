export type KnockoutStageType =
  | "quarter_final"
  | "semi_final"
  | "final"
  | "third_place";

export type KnockoutStageDefinition = {
  type: KnockoutStageType;
  label: string;
  teamSlots: number;
  matchCount: number;
  nextStageType: KnockoutStageType | null;
};

export type KnockoutMatchSlot = {
  matchNumber: number;
  slotA: string;
  slotB: string;
};

export type KnockoutStageSeed = {
  stageType: KnockoutStageType;
  stageName: string;
  matches: KnockoutMatchSlot[];
};

export type KnockoutAdvanceTarget =
  | {
      nextStageType: "semi_final";
      nextMatchNumber: 1 | 2;
      nextSlot: "teamAId" | "teamBId";
    }
  | {
      nextStageType: "final";
      nextMatchNumber: 1;
      nextSlot: "teamAId" | "teamBId";
    }
  | null;

export type KnockoutConsolationTarget = {
  nextStageType: "third_place";
  nextMatchNumber: 1;
  nextSlot: "teamAId" | "teamBId";
} | null;
