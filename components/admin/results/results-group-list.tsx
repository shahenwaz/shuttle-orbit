import { CreateSheet } from "@/components/admin/create-sheet";
import { RecordMatchResultForm } from "@/components/admin/results/record-match-result-form";
import { EmptyState } from "@/components/shared/empty-state";
import { MatchCard } from "@/components/tournaments/match-card";
import { formatTeamName } from "@/lib/utils/format";

type MatchRow = {
  id: string;
  roundLabel: string | null;
  status: string;
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
      <EmptyState message="No groups available yet. Create groups and fixtures first." />
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {groups.map((group) => (
        <div key={group.id} className="surface-panel p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
            <h4 className="text-base font-semibold text-foreground">
              {group.name}
            </h4>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
              {group.matches.length} matches
            </span>
          </div>

          {group.matches.length === 0 ? (
            <EmptyState message="No fixtures generated yet for this group." />
          ) : (
            <div className="grid gap-1.5 sm:gap-2">
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
                    className="space-y-2 rounded-2xl border border-white/10 bg-white/4 p-2.5"
                  >
                    <MatchCard match={match} />

                    <div className="flex justify-end">
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
