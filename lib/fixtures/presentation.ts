import type {
  FixtureTemplateConfig,
  GroupStageTemplateConfig,
  KnockoutStageTemplateConfig,
} from "@/lib/fixtures/types";

export function toFixtureTemplatePreview(template: FixtureTemplateConfig) {
  const groupStage = template.stages.find(
    (stage): stage is GroupStageTemplateConfig => stage.type === "group_stage",
  );

  const knockoutStage = template.stages.find(
    (stage): stage is KnockoutStageTemplateConfig =>
      stage.type === "knockout_stage",
  );

  return {
    title: template.label,
    description: template.description,
    groups:
      groupStage?.groupLabels.map((label, index) => ({
        label,
        size: groupStage.groupSizes[index] ?? 0,
        qualifiers: groupStage.qualifiersPerGroup[index] ?? 0,
      })) ?? [],
    knockoutMatches:
      knockoutStage?.matches.map((match) => ({
        roundLabel: match.roundLabel,
        pairing: `${formatSlot(match.sideA)} vs ${formatSlot(match.sideB)}`,
      })) ?? [],
  };
}

function formatSlot(
  slot:
    | { groupLabel: string; position: number }
    | { source: "custom"; label: string },
) {
  if ("source" in slot) {
    return slot.label;
  }

  return `${slot.groupLabel}${slot.position}`;
}
