import { surfaceCardClassName } from "@/components/shared/surface-card";
import { cn } from "@/lib/utils";
import { formatTeamName } from "@/lib/utils/format";

type MatchCardProps = {
  contextLabel?: string;
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

  const match = scoreSummary.trim().match(/^(\d+)\s*-\s*(\d+)$/);

  if (!match) {
    return null;
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
    setDetails: orderedSets.map((set) => `${set.teamAScore}–${set.teamBScore}`),
    isMultiSet: true,
  };
}

export function MatchCard({ match, contextLabel }: MatchCardProps) {
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
  const hasCompletedScore =
    match.status === "completed" && score.displayScore !== null;

  return (
    <article
      className={surfaceCardClassName({
        variant: "elevated",
        accent: "brand",
        className: "min-w-0 overflow-hidden px-3 py-1.5 sm:px-3.5",
      })}
    >
      <div className="min-w-0 space-y-1">
        <p className="truncate text-[10px] leading-5 font-semibold uppercase tracking-[0.16em] text-foreground sm:text-[11px]">
          {contextLabel ?? match.roundLabel ?? "Match"}
        </p>

        <div className="space-y-0.5 border-t border-white/10 pt-1.5">
          <div className="flex min-w-0 items-center gap-2">
            <p
              className={cn(
                "min-w-0 flex-1 truncate text-xs leading-5 text-primary sm:text-[13px]",
                teamAIsWinner ? "font-semibold" : "font-medium",
                !match.teamA && "text-muted-foreground",
              )}
              title={teamALabel}
            >
              {teamALabel}
            </p>

            <span
              className={cn(
                "shrink-0 text-sm leading-5 font-bold tracking-tight tabular-nums",
                teamAIsWinner ? "text-purple-400" : "text-foreground",
                !hasCompletedScore && "text-muted-foreground",
              )}
            >
              {hasCompletedScore && score.displayScore
                ? score.displayScore.teamAScore
                : "—"}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <p
              className={cn(
                "min-w-0 flex-1 truncate text-xs leading-5 text-primary sm:text-[13px]",
                teamBIsWinner ? "font-semibold" : "font-medium",
                !match.teamB && "text-muted-foreground",
              )}
              title={teamBLabel}
            >
              {teamBLabel}
            </p>

            <span
              className={cn(
                "shrink-0 text-sm leading-5 font-bold tracking-tight tabular-nums",
                teamBIsWinner ? "text-purple-400" : "text-foreground",
                !hasCompletedScore && "text-muted-foreground",
              )}
            >
              {hasCompletedScore && score.displayScore
                ? score.displayScore.teamBScore
                : "—"}
            </span>
          </div>
        </div>

        {score.isMultiSet ? (
          <div className="flex flex-wrap items-baseline gap-x-2 border-t border-white/10 pt-1">
            <span className="shrink-0 text-[9px] leading-5 font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
              Sets
            </span>
            <p className="min-w-0 flex-1 text-[9px] leading-5 font-medium text-muted-foreground tabular-nums sm:text-[10px]">
              {score.setDetails.join(" · ")}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
