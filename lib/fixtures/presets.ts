import type { FixtureTemplateConfig } from "@/lib/fixtures/types";

export const CATEGORY_C_13_TEAMS_PRESET: FixtureTemplateConfig = {
  key: "round_robin_three_groups_custom_qualifiers",
  label: "Category C · 13 teams · 4/4/5 groups",
  description:
    "Three groups for older players with reduced match load. Top 1 from A and B, top 2 from C.",
  stages: [
    {
      type: "group_stage",
      stageName: "Group Stage",
      groupLabels: ["A", "B", "C"],
      groupSizes: [4, 4, 5],
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
};
