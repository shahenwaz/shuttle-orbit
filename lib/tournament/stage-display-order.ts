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

  if (
    stage.stageType === "third_place" ||
    normalizedName.includes("third place")
  ) {
    return 950;
  }

  if (stage.stageType === "semi_final") {
    return 900;
  }

  if (stage.stageType === "quarter_final") {
    return 800;
  }

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

    return a.stageOrder - b.stageOrder;
  });
}
