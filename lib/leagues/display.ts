export function formatLeagueDisplayName(value: string | null | undefined) {
  return (value || "TBD").trim().toLocaleUpperCase("en-IE");
}
