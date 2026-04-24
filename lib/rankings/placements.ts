import type { PlacementTier } from "@prisma/client";

export function getFinishLabel(placementTier: PlacementTier): string {
  switch (placementTier) {
    case "CHAMPION":
      return "Champion";
    case "RUNNER_UP":
      return "Runner-up";
    case "SEMI_FINALIST":
      return "Semi-finalist";
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

export function normalizeRoundLabel(roundLabel: string | null | undefined) {
  return (roundLabel ?? "").trim().toLowerCase();
}

export function isThirdPlaceRound(roundLabel: string | null | undefined) {
  const normalized = normalizeRoundLabel(roundLabel);

  return (
    normalized.includes("3rd") ||
    normalized.includes("third") ||
    normalized.includes("bronze")
  );
}

export function isSemiFinalRound(roundLabel: string | null | undefined) {
  const normalized = normalizeRoundLabel(roundLabel);

  return normalized.includes("semi");
}

export function isFinalRound(roundLabel: string | null | undefined) {
  const normalized = normalizeRoundLabel(roundLabel);

  if (!normalized.includes("final")) {
    return false;
  }

  if (isSemiFinalRound(normalized) || isThirdPlaceRound(normalized)) {
    return false;
  }

  return true;
}
