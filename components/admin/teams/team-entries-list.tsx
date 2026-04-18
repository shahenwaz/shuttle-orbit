"use client";

import { useActionState } from "react";

import { removeTeamEntryAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/teams/actions";
import { Button } from "@/components/ui/button";
import { formatTeamName } from "@/lib/utils/format";

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

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "confirmed":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    default:
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
  }
}

export function TeamEntriesList({
  tournamentId,
  categoryId,
  teams,
}: TeamEntriesListProps) {
  if (teams.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No teams added yet. Create the first team for this category.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
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
    <div className="surface-panel p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-base font-semibold text-foreground">
              {formatTeamName(
                team.player1.fullName,
                team.player2.fullName,
                team.teamName,
              )}
            </h4>
            <span
              className={`rounded-full border px-2.5 py-1 text-xs ${getStatusBadgeClass(
                team.status,
              )}`}
            >
              {team.status}
            </span>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              {team.player1.fullName} @{team.player1.nickname}
            </p>
            <p>
              {team.player2.fullName} @{team.player2.nickname}
            </p>
          </div>

          {state.message ? (
            <p
              className={`text-sm ${
                state.success ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {state.message}
            </p>
          ) : null}
        </div>

        <form action={formAction}>
          <input type="hidden" name="tournamentId" value={tournamentId} />
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="teamEntryId" value={team.id} />
          <Button
            type="submit"
            variant="outline"
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
