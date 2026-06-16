export function formatClubLeagueDisplayName(value: string | null | undefined) {
  return (value || "TBD").trim().toLocaleUpperCase("en-IE");
}
