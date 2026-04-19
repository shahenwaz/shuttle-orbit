import type { FixtureTemplateConfig } from "@/lib/fixtures/types";

export const FIXTURE_TEMPLATES: FixtureTemplateConfig[] = [
  {
    key: "round_robin_single_group",
    label: "Single group round robin",
    description: "One round robin group with manual knockout decision later.",
    stages: [
      {
        type: "group_stage",
        stageName: "Group Stage",
        groupLabels: ["A"],
        groupSizes: [0],
        qualifiersPerGroup: [0],
      },
    ],
  },
  {
    key: "round_robin_two_groups_top2",
    label: "Two groups, top 2 qualify",
    description: "Two round robin groups feeding semifinals.",
    stages: [
      {
        type: "group_stage",
        stageName: "Group Stage",
        groupLabels: ["A", "B"],
        groupSizes: [0, 0],
        qualifiersPerGroup: [2, 2],
      },
      {
        type: "knockout_stage",
        stageName: "Semi Finals",
        matches: [
          {
            roundLabel: "Semi Final 1",
            sideA: { groupLabel: "A", position: 1 },
            sideB: { groupLabel: "B", position: 2 },
          },
          {
            roundLabel: "Semi Final 2",
            sideA: { groupLabel: "B", position: 1 },
            sideB: { groupLabel: "A", position: 2 },
          },
        ],
      },
    ],
  },
  {
    key: "round_robin_three_groups_custom_qualifiers",
    label: "Three groups with custom qualifiers",
    description: "Three round robin groups with configurable qualifier counts.",
    stages: [
      {
        type: "group_stage",
        stageName: "Group Stage",
        groupLabels: ["A", "B", "C"],
        groupSizes: [0, 0, 0],
        qualifiersPerGroup: [1, 1, 2],
      },
      {
        type: "knockout_stage",
        stageName: "Semi Finals",
        matches: [
          {
            roundLabel: "Semi Final 1",
            sideA: { groupLabel: "A", position: 1 },
            sideB: { groupLabel: "C", position: 2 },
          },
          {
            roundLabel: "Semi Final 2",
            sideA: { groupLabel: "B", position: 1 },
            sideB: { groupLabel: "C", position: 1 },
          },
        ],
      },
    ],
  },
  {
    key: "manual_custom",
    label: "Manual custom setup",
    description:
      "Admin defines groups, qualifiers, and knockout flow manually.",
    stages: [],
  },
];
