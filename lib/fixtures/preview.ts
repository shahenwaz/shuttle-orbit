type PreviewGroup = {
  label: string;
  size: number;
  qualifiers: number;
};

type PreviewKnockoutMatch = {
  roundLabel: string;
  pairing: string;
};

export function buildFixtureTemplatePreview(config: {
  groupLabels: string[];
  groupSizes: number[];
  qualifiersPerGroup: number[];
  semiFinals?: Array<{
    roundLabel: string;
    pairing: string;
  }>;
}) {
  const groups: PreviewGroup[] = config.groupLabels.map((label, index) => ({
    label,
    size: config.groupSizes[index],
    qualifiers: config.qualifiersPerGroup[index],
  }));

  const knockoutMatches: PreviewKnockoutMatch[] = config.semiFinals ?? [];

  return {
    groups,
    knockoutMatches,
  };
}
