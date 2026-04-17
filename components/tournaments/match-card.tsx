import { Badge } from "@/components/ui/badge";
import { formatTeamName } from "@/lib/utils/format";

type MatchCardProps = {
  match: {
    id: string;
    status: string;
    scoreSummary: string | null;
    roundLabel: string | null;
    winnerId: string | null;
    teamAId: string;
    teamBId: string;
    teamA: {
      teamName: string | null;
      player1: { fullName: string };
      player2: { fullName: string };
    };
    teamB: {
      teamName: string | null;
      player1: { fullName: string };
      player2: { fullName: string };
    };
    sets: Array<{
      id?: string;
      setNumber: number;
      teamAScore: number;
      teamBScore: number;
    }>;
  };
};

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
    <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {match.roundLabel ?? "Match"}
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {match.status}
          </p>
        </div>

        {match.scoreSummary ? (
          <Badge variant="secondary" className="rounded-full">
            {match.scoreSummary}
          </Badge>
        ) : null}
      </div>

      <div className="space-y-3">
        <div
          className={`rounded-xl border px-3 py-3 ${
            teamAIsWinner
              ? "border-primary/30 bg-primary/10"
              : "border-white/10 bg-white/5"
          }`}
        >
          <p className="font-medium">{teamALabel}</p>
        </div>

        <div
          className={`rounded-xl border px-3 py-3 ${
            teamBIsWinner
              ? "border-primary/30 bg-primary/10"
              : "border-white/10 bg-white/5"
          }`}
        >
          <p className="font-medium">{teamBLabel}</p>
        </div>
      </div>

      {match.sets.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Set scores
          </p>

          <div className="space-y-2">
            {match.sets.map((set) => (
              <div
                key={set.setNumber}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
              >
                <span>Set {set.setNumber}</span>
                <span className="font-medium">
                  {set.teamAScore} - {set.teamBScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
