export type KnockoutStartStage = "quarter_final" | "semi_final" | "final";

export type KnockoutRoundDefinition = {
  stageType: KnockoutStartStage;
  stageOrder: number;
  name: string;
  roundLabelPrefix: string;
  matchCount: number;
};

export const KNOCKOUT_START_STAGE_OPTIONS: Array<{
  value: KnockoutStartStage;
  label: string;
}> = [
  { value: "quarter_final", label: "Quarter final" },
  { value: "semi_final", label: "Semi final" },
  { value: "final", label: "Final" },
];

export function getKnockoutRoundDefinitions(
  startStage: KnockoutStartStage,
): KnockoutRoundDefinition[] {
  switch (startStage) {
    case "quarter_final":
      return [
        {
          stageType: "quarter_final",
          stageOrder: 100,
          name: "Quarter Finals",
          roundLabelPrefix: "QF",
          matchCount: 4,
        },
        {
          stageType: "semi_final",
          stageOrder: 101,
          name: "Semi Finals",
          roundLabelPrefix: "SF",
          matchCount: 2,
        },
        {
          stageType: "final",
          stageOrder: 102,
          name: "Final",
          roundLabelPrefix: "Final",
          matchCount: 1,
        },
      ];

    case "semi_final":
      return [
        {
          stageType: "semi_final",
          stageOrder: 100,
          name: "Semi Finals",
          roundLabelPrefix: "SF",
          matchCount: 2,
        },
        {
          stageType: "final",
          stageOrder: 101,
          name: "Final",
          roundLabelPrefix: "Final",
          matchCount: 1,
        },
      ];

    case "final":
      return [
        {
          stageType: "final",
          stageOrder: 100,
          name: "Final",
          roundLabelPrefix: "Final",
          matchCount: 1,
        },
      ];
  }
}

export function getKnockoutRoundLabel(
  roundLabelPrefix: string,
  index: number,
  matchCount: number,
) {
  if (matchCount === 1) {
    return roundLabelPrefix;
  }

  return `${roundLabelPrefix} ${index + 1}`;
}
