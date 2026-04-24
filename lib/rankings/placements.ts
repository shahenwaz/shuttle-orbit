import type { PlacementTier } from "@prisma/client";

type PlacementContext = {
  hasThirdPlaceMatch: boolean;
  isThirdPlaceWinner?: boolean;
  isThirdPlaceLoser?: boolean;
  reachedFinal?: boolean;
  wonFinal?: boolean;
  lostFinal?: boolean;
  reachedAdvancedStage?: boolean;
  playedAnyMatch?: boolean;
};

export function getPlacementTierFromContext({
  hasThirdPlaceMatch,
  isThirdPlaceWinner = false,
  isThirdPlaceLoser = false,
  reachedFinal = false,
  wonFinal = false,
  lostFinal = false,
  reachedAdvancedStage = false,
  playedAnyMatch = false,
}: PlacementContext): PlacementTier {
  if (wonFinal) {
    return "CHAMPION";
  }

  if (lostFinal || reachedFinal) {
    return "RUNNER_UP";
  }

  if (hasThirdPlaceMatch && isThirdPlaceWinner) {
    return "THIRD_PLACE";
  }

  if (hasThirdPlaceMatch && isThirdPlaceLoser) {
    return "FOURTH_PLACE";
  }

  if (reachedAdvancedStage) {
    return "ADVANCED_STAGE";
  }

  if (playedAnyMatch) {
    return "GROUP_STAGE";
  }

  return "PARTICIPATION";
}

export function getFinishLabel(placementTier: PlacementTier): string {
  switch (placementTier) {
    case "CHAMPION":
      return "Champion";
    case "RUNNER_UP":
      return "Runner-up";
    case "THIRD_PLACE":
      return "3rd Place";
    case "FOURTH_PLACE":
      return "4th Place";
    case "ADVANCED_STAGE":
      return "Advanced Stage";
    case "GROUP_STAGE":
      return "Group Stage";
    case "PARTICIPATION":
    default:
      return "Participation";
  }
}
