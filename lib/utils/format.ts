export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTeamName(
  player1Name: string,
  player2Name: string,
  teamName?: string | null,
) {
  if (teamName) return teamName;

  return `${player1Name} / ${player2Name}`;
}
