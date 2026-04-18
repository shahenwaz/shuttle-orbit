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

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "completed":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    default:
      return "border-white/10 bg-white/5 text-muted-foreground";
  }
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

  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-3 sm:p-4">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground">
            {match.roundLabel ?? "Match"}
          </p>

          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs",
              getStatusBadgeClass(match.status),
            )}
          >
            {match.status}
          </span>

          {match.scoreSummary ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-foreground">
              {match.scoreSummary}
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <div
            className={cn(
              "rounded-xl border px-3 py-2",
              teamAIsWinner
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-white/10 bg-white/5",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                {teamALabel}
              </p>
              {teamAIsWinner ? (
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                  Winner
                </span>
              ) : null}
            </div>
          </div>

          <div className="px-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            vs
          </div>

          <div
            className={cn(
              "rounded-xl border px-3 py-2",
              teamBIsWinner
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-white/10 bg-white/5",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                {teamBLabel}
              </p>
              {teamBIsWinner ? (
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                  Winner
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
