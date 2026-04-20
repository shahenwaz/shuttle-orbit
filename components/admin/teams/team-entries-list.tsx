"use client";

import { useActionState } from "react";

import { removeTeamEntryAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/teams/actions";
import { EmptyState } from "@/components/shared/empty-state";
import { TeamCard } from "@/components/tournaments/team-card";
import { Button } from "@/components/ui/button";

type TeamEntryRow = {
  id: string;
  teamName: string | null;
  status: string;
  player1: {
    fullName: string;
    nickname: string;
  };
  player2: {
    fullName: string;
    nickname: string;
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
        <TeamEntryCard
          key={team.id}
          tournamentId={tournamentId}
          categoryId={categoryId}
          team={team}
        />
      ))}
    </div>
  );
}

function TeamEntryCard({
  tournamentId,
  categoryId,
  team,
}: {
  tournamentId: string;
  categoryId: string;
  team: TeamEntryRow;
}) {
  const [state, formAction, isPending] = useActionState(removeTeamEntryAction, {
    success: false,
    message: "",
  });

  return (
    <div>
      <TeamCard
        team={{
          id: team.id,
          teamName: team.teamName,
          player1: {
            fullName: team.player1.fullName,
            nickname: team.player1.nickname,
          },
          player2: {
            fullName: team.player2.fullName,
            nickname: team.player2.nickname,
          },
        }}
        badgeLabel="Team"
      />

      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        {state.message ? (
          <p
            className={`text-sm ${
              state.success ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {state.message}
          </p>
        ) : (
          <div />
        )}

        <form action={formAction}>
          <input type="hidden" name="tournamentId" value={tournamentId} />
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="teamEntryId" value={team.id} />
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            disabled={isPending}
          >
            Remove
          </Button>
        </form>
      </div>
    </div>
  );
}
