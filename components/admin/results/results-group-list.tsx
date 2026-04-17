import { CreateSheet } from "@/components/admin/create-sheet";
import { RecordMatchResultForm } from "@/components/admin/results/record-match-result-form";
import { formatTeamName } from "@/lib/utils/format";

type MatchRow = {
  id: string;
  roundLabel: string | null;
  status: string;
  scoreSummary: string | null;
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

type GroupResultRow = {
  id: string;
  name: string;
  matches: MatchRow[];
};

type ResultsGroupListProps = {
  tournamentId: string;
  categoryId: string;
  groups: GroupResultRow[];
};

export function ResultsGroupList({
  tournamentId,
  categoryId,
  groups,
}: ResultsGroupListProps) {
  if (groups.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No groups available yet. Create groups and fixtures first.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {groups.map((group) => (
        <div key={group.id} className="surface-panel p-4">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h4 className="text-base font-semibold text-foreground">
              {group.name}
            </h4>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
              {group.matches.length} matches
            </span>
          </div>

          {group.matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No fixtures generated yet for this group.
            </p>
          ) : (
            <div className="grid gap-3">
              {group.matches.map((match) => {
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

                return (
                  <div
                    key={match.id}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {match.roundLabel ?? "Match"}
                          </p>
                          <span className="rounded-full border border-white/10 bg-background/60 px-2.5 py-1 text-xs text-muted-foreground">
                            {match.status}
                          </span>
                          {match.scoreSummary ? (
                            <span className="rounded-full border border-white/10 bg-background/60 px-2.5 py-1 text-xs text-foreground">
                              {match.scoreSummary}
                            </span>
                          ) : null}
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-foreground">
                            {teamALabel}
                          </p>
                          <p className="text-xs text-muted-foreground">vs</p>
                          <p className="text-sm text-foreground">
                            {teamBLabel}
                          </p>
                        </div>
                      </div>

                      <CreateSheet
                        triggerLabel={
                          match.status === "completed"
                            ? "Edit result"
                            : "Record result"
                        }
                        title="Record match result"
                        description="Enter the single-set score for this match."
                      >
                        <RecordMatchResultForm
                          tournamentId={tournamentId}
                          categoryId={categoryId}
                          matchId={match.id}
                          teamALabel={teamALabel}
                          teamBLabel={teamBLabel}
                        />
                      </CreateSheet>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
