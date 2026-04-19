export type FixtureTemplateKey =
  | "round_robin_single_group"
  | "round_robin_two_groups_top2"
  | "round_robin_three_groups_custom_qualifiers"
  | "manual_custom";

export type StageTemplateType = "group_stage" | "knockout_stage";

export type GroupStageTemplateConfig = {
  type: "group_stage";
  stageName: string;
  groupLabels: string[];
  groupSizes: number[];
  qualifiersPerGroup: number[];
};

export type KnockoutPairingSlot =
  | { groupLabel: string; position: 1 | 2 | 3 | 4 }
  | { source: "custom"; label: string };

export type KnockoutMatchTemplate = {
  roundLabel: string;
  sideA: KnockoutPairingSlot;
  sideB: KnockoutPairingSlot;
};

export type KnockoutStageTemplateConfig = {
  type: "knockout_stage";
  stageName: string;
  matches: KnockoutMatchTemplate[];
};

export type FixtureTemplateConfig = {
  key: FixtureTemplateKey;
  label: string;
  description: string;
  stages: Array<GroupStageTemplateConfig | KnockoutStageTemplateConfig>;
};
