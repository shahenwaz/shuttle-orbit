export type KnockoutStageType = "quarter_final" | "semi_final" | "final";

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
