"use client";

import { useActionState } from "react";

import { resetGroupFixturesAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { EmptyState } from "@/components/shared/empty-state";
import { MatchCard } from "@/components/tournaments/match-card";
import { Button } from "@/components/ui/button";

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
      nickname: string;
    };
    player2: {
      fullName: string;
      nickname: string;
    };
  };
  teamB: {
    teamName: string | null;
    player1: {
      fullName: string;
      nickname: string;
    };
    player2: {
      fullName: string;
      nickname: string;
    };
  };
};

type GroupFixtureRow = {
  id: string;
  name: string;
  memberships: Array<{ id: string }>;
  matches: MatchRow[];
};

type FixturesGroupListProps = {
  tournamentId: string;
  categoryId: string;
  groups: GroupFixtureRow[];
};

export function FixturesGroupList({
  tournamentId,
  categoryId,
  groups,
}: FixturesGroupListProps) {
  if (groups.length === 0) {
    return (
      <EmptyState message="No groups available yet. Create groups first before generating fixtures." />
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {groups.map((group) => (
        <FixtureGroupCard
          key={group.id}
          tournamentId={tournamentId}
          categoryId={categoryId}
          group={group}
        />
      ))}
    </div>
  );
}

function FixtureGroupCard({
  tournamentId,
  categoryId,
  group,
}: {
  tournamentId: string;
  categoryId: string;
  group: GroupFixtureRow;
}) {
  const [state, formAction, isPending] = useActionState(
    resetGroupFixturesAction,
    {
      success: false,
      message: "",
    },
  );

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <h4 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
              {group.name}
            </h4>

            <span className="text-xs text-muted-foreground sm:text-sm">⁜</span>

            <span className="text-xs text-muted-foreground sm:text-sm">
              {group.memberships.length} teams
            </span>

            <span className="text-xs text-muted-foreground sm:text-sm">⁜</span>

            <span className="text-xs text-muted-foreground sm:text-sm">
              {group.matches.length} matches
            </span>
          </div>

          <form action={formAction}>
            <input type="hidden" name="tournamentId" value={tournamentId} />
            <input type="hidden" name="categoryId" value={categoryId} />
            <input type="hidden" name="groupId" value={group.id} />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={isPending || group.matches.length === 0}
            >
              Reset fixtures
            </Button>
          </form>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {state.message ? (
          <p
            className={`mb-3 text-sm ${
              state.success ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        {group.matches.length === 0 ? (
          <EmptyState message="No fixtures generated yet for this group." />
        ) : (
          <div className="grid gap-1.5 sm:gap-2">
            {group.matches.map((match) => (
              <div key={match.id}>
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
