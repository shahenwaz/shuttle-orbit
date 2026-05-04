import { cn } from "@/lib/utils";
import { formatTeamName } from "@/lib/utils/format";

type MatchCardProps = {
  match: {
    id: string;
    status: string;
    roundLabel: string | null;
    scoreSummary: string | null;
    winnerId: string | null;
    teamAId: string | null;
    teamBId: string | null;
    teamA: {
      teamName: string | null;
      player1: {
        fullName: string;
      };
      player2: {
        fullName: string;
      };
    } | null;
    teamB: {
      teamName: string | null;
      player1: {
        fullName: string;
      };
      player2: {
        fullName: string;
      };
    } | null;
    sets?: Array<{
      setNumber: number;
      teamAScore: number;
      teamBScore: number;
    }>;
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

function getSetScoreSummary(
  sets: MatchCardProps["match"]["sets"],
  scoreSummary: string | null,
) {
  const orderedSets = [...(sets ?? [])].sort(
    (a, b) => a.setNumber - b.setNumber,
  );

  if (orderedSets.length === 0) {
    return {
      displayScore: getScoreParts(scoreSummary),
      setDetails: [],
      isMultiSet: false,
    };
  }

  if (orderedSets.length === 1) {
    return {
      displayScore: {
        teamAScore: String(orderedSets[0].teamAScore),
        teamBScore: String(orderedSets[0].teamBScore),
      },
      setDetails: [],
      isMultiSet: false,
    };
  }

  const teamASetWins = orderedSets.filter(
    (set) => set.teamAScore > set.teamBScore,
  ).length;

  const teamBSetWins = orderedSets.filter(
    (set) => set.teamBScore > set.teamAScore,
  ).length;

  return {
    displayScore: {
      teamAScore: String(teamASetWins),
      teamBScore: String(teamBSetWins),
    },
    setDetails: orderedSets.map(
      (set) => `${set.teamAScore} - ${set.teamBScore}`,
    ),
    isMultiSet: true,
  };
}

export function MatchCard({ match }: MatchCardProps) {
  const teamALabel = match.teamA
    ? formatTeamName(
        match.teamA.player1.fullName,
        match.teamA.player2.fullName,
        match.teamA.teamName,
      )
    : "TBD";

  const teamBLabel = match.teamB
    ? formatTeamName(
        match.teamB.player1.fullName,
        match.teamB.player2.fullName,
        match.teamB.teamName,
      )
    : "TBD";

  const teamAIsWinner =
    match.winnerId != null && match.winnerId === match.teamAId;
  const teamBIsWinner =
    match.winnerId != null && match.winnerId === match.teamBId;

  const score = getSetScoreSummary(match.sets, match.scoreSummary);

  const displayScore =
    score.displayScore !== null && typeof score.displayScore !== "string"
      ? score.displayScore
      : null;

  const hasCompletedScore =
    match.status === "completed" && displayScore !== null;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/4">
      <div className="flex items-center justify-center gap-3 border-b border-white/10 px-3 py-2.5 sm:px-4">
        <p className="truncate text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
          {match.roundLabel ?? "Match"}
        </p>
      </div>

      <div className="px-3 py-3 sm:px-4 sm:py-3.5">
        {hasCompletedScore ? (
          <div className="space-y-2.5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
              <p
                className={cn(
                  "truncate text-xs sm:text-sm",
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
                  {displayScore?.teamAScore}
                </span>
                <span className="px-1.5 text-muted-foreground">-</span>
                <span
                  className={cn(
                    teamBIsWinner ? "text-primary" : "text-foreground",
                  )}
                >
                  {displayScore?.teamBScore}
                </span>
              </div>

              <p
                className={cn(
                  "truncate text-right text-xs sm:text-sm",
                  teamBIsWinner
                    ? "font-semibold text-foreground"
                    : "font-medium text-muted-foreground",
                )}
                title={teamBLabel}
              >
                {teamBLabel}
              </p>
            </div>

            {score.isMultiSet ? (
              <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/8 pt-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Sets
                </span>

                {score.setDetails.map((setScore, index) => (
                  <span
                    key={`${match.id}-set-${index}`}
                    className="rounded-full border border-white/10 bg-background/45 px-2 py-0.5 text-[10px] font-semibold text-foreground sm:text-[11px]"
                  >
                    {setScore}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
            <p
              className="truncate text-xs font-medium text-foreground sm:text-sm"
              title={teamALabel}
            >
              {teamALabel}
            </p>

            <div className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-xs">
              VS
            </div>

            <p
              className="truncate text-right text-xs font-medium text-foreground sm:text-sm"
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
