type StageForDisplayOrder = {
  stageType: string;
  name: string;
  stageOrder: number;
};

function normalizeStageName(name: string) {
  return name.trim().toLowerCase();
}

export function getStageDisplayPriority(stage: StageForDisplayOrder) {
  const normalizedName = normalizeStageName(stage.name);

  if (stage.stageType === "final") {
    return 1000;
  }

  if (normalizedName.includes("third place")) {
    return 950;
  }

  if (stage.stageType === "semi_final") {
    return 900;
  }

  if (stage.stageType === "quarter_final") {
    return 800;
  }

  // All non-knockout stages share the same base priority.
  // Their relative order is resolved by the stageOrder tiebreak
  // in sortStagesForDisplay (ascending: lower stageOrder = shown first).
  return 100;
}

export function sortStagesForDisplay<T extends StageForDisplayOrder>(
  stages: T[],
) {
  return [...stages].sort((a, b) => {
    const priorityDiff =
      getStageDisplayPriority(b) - getStageDisplayPriority(a);

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    // Tiebreak: ascending stageOrder so earlier-created stages appear first.
    // Knockout stages always have distinct priorities (1000/950/900/800),
    // so this tiebreak only ever applies to group-type stages.
    return a.stageOrder - b.stageOrder;
  });
}
