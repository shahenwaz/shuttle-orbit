import { TeamEntryActions } from "@/components/admin/teams/team-entry-actions";
import { EmptyState } from "@/components/shared/empty-state";
import { TeamCard } from "@/components/tournaments/team-card";

type TeamEntryRow = {
  id: string;
  teamName: string | null;
  status: string;
  player1: {
    id: string;
    fullName: string;
    nickname: string | null;
  };
  player2: {
    id: string;
    fullName: string;
    nickname: string | null;
  };
};

type TeamEntriesListProps = {
  tournamentId: string;
  categoryId: string;
  teams: TeamEntryRow[];
};

export function TeamEntriesList({
  tournamentId,
  categoryId,
  teams,
}: TeamEntriesListProps) {
  if (teams.length === 0) {
    return (
      <EmptyState message="No teams added yet. Create the first team for this category." />
    );
  }

  return (
    <div className="grid gap-1.5 sm:gap-2 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <div key={team.id} className="relative">
          <TeamEntryActions
            tournamentId={tournamentId}
            categoryId={categoryId}
            team={{
              id: team.id,
              teamName: team.teamName,
            }}
          />

          <TeamCard
            team={{
              id: team.id,
              teamName: team.teamName,
              player1: {
                id: team.player1.id,
                fullName: team.player1.fullName,
                nickname: team.player1.nickname,
              },
              player2: {
                id: team.player2.id,
                fullName: team.player2.fullName,
                nickname: team.player2.nickname,
              },
            }}
            badgeLabel="team"
          />
        </div>
      ))}
    </div>
  );
}
