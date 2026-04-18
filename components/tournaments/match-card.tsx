import { cn } from "@/lib/utils";
import { formatTeamName } from "@/lib/utils/format";

type MatchCardProps = {
  match: {
    id: string;
    status: string;
    roundLabel: string | null;
    scoreSummary: string | null;
    winnerId: string | null;
    teamAId: string;
    teamBId: string;
    teamA: {
      teamName: string | null;
      player1: {
        fullName: string;
      };
      player2: {
        fullName: string;
      };
    };
    teamB: {
      teamName: string | null;
      player1: {
        fullName: string;
      };
      player2: {
        fullName: string;
      };
    };
  };
};

function getScoreParts(scoreSummary: string | null) {
  if (!scoreSummary) {
    return null;
  }

  const cleaned = scoreSummary.trim();
  const match = cleaned.match(/^(\d+)\s*-\s*(\d+)$/);

  if (!match) {
    return cleaned;
  }

  return {
    teamAScore: match[1],
    teamBScore: match[2],
  };
}

export function MatchCard({ match }: MatchCardProps) {
  const teamALabel = formatTeamName(
    match.teamA.player1.fullName,
    match.teamA.player2.fullName,
    match.teamA.teamName,
  );

  const teamBLabel = formatTeamName(
    match.teamB.player1.fullName,
    match.teamB.player2.fullName,
    match.teamB.teamName,
  );

  const teamAIsWinner = match.winnerId === match.teamAId;
  const teamBIsWinner = match.winnerId === match.teamBId;
  const parsedScore = getScoreParts(match.scoreSummary);
  const hasCompletedScore =
    match.status === "completed" &&
    parsedScore !== null &&
    typeof parsedScore !== "string";

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/4">
      <div className="flex items-center justify-center gap-3 border-b border-white/10 px-3 py-2.5 sm:px-4">
        <p className="truncate text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
          {match.roundLabel ?? "Match"}
        </p>
      </div>

      <div className="px-3 py-3 sm:px-4 sm:py-3.5">
        {hasCompletedScore ? (
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
            <p
              className={cn(
                "truncate text-[11px] sm:text-sm",
                teamAIsWinner
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground",
              )}
              title={teamALabel}
            >
              {teamALabel}
            </p>

            <div className="shrink-0 whitespace-nowrap text-sm font-bold tracking-tight text-foreground sm:text-base">
              <span
                className={cn(
                  teamAIsWinner ? "text-primary" : "text-foreground",
                )}
              >
                {parsedScore.teamAScore}
              </span>
              <span className="px-1.5 text-muted-foreground">-</span>
              <span
                className={cn(
                  teamBIsWinner ? "text-primary" : "text-foreground",
                )}
              >
                {parsedScore.teamBScore}
              </span>
            </div>

            <p
              className={cn(
                "truncate text-right text-[11px] sm:text-sm",
                teamBIsWinner
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground",
              )}
              title={teamBLabel}
            >
              {teamBLabel}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
            <p
              className="truncate text-[11px] font-medium text-foreground sm:text-sm"
              title={teamALabel}
            >
              {teamALabel}
            </p>

            <div className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-xs">
              VS
            </div>

            <p
              className="truncate text-right text-[11px] font-medium text-foreground sm:text-sm"
              title={teamBLabel}
            >
              {teamBLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
