export const RANKING_POINTS_BY_PLACEMENT = {
  CHAMPION: 1000,
  RUNNER_UP: 850,
  THIRD_PLACE: 750,
  SEMI_FINALIST: 700,
  FOURTH_PLACE: 650,
  ADVANCED_STAGE: 500,
  GROUP_STAGE: 350,
  PARTICIPATION: 0, // Registered-only teams should not receive ranking points.
} as const;

export const CATEGORY_MULTIPLIERS = {
  A: 1,
  B: 0.95,
  C: 0.68,
  MIXED: 0.82,
  OPEN: 1,
} as const;

export type RankingPlacementTier = keyof typeof RANKING_POINTS_BY_PLACEMENT;

export function getBasePointsForPlacement(
  placementTier: RankingPlacementTier,
): number {
  return RANKING_POINTS_BY_PLACEMENT[placementTier];
}

export function getCategoryMultiplier(categoryCode: string): number {
  const normalizedCode = categoryCode.trim().toUpperCase();

  if (normalizedCode in CATEGORY_MULTIPLIERS) {
    return CATEGORY_MULTIPLIERS[
      normalizedCode as keyof typeof CATEGORY_MULTIPLIERS
    ];
  }

  return 1;
}

export function getTotalRankingPoints(
  placementTier: RankingPlacementTier,
  categoryCode: string,
): number {
  const basePoints = getBasePointsForPlacement(placementTier);
  const multiplier = getCategoryMultiplier(categoryCode);

  return Math.round(basePoints * multiplier);
}
