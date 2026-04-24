export function formatDate(date: Date | string | null | undefined) {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export function formatTeamName(
  player1Name: string,
  player2Name: string,
  teamName?: string | null,
) {
  if (teamName) return teamName;

  return `${player1Name} / ${player2Name}`;
}
