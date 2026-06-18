import type { LeagueFormat } from "@prisma/client";

export function formatLeagueFormat(format: LeagueFormat | string) {
  return format
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
