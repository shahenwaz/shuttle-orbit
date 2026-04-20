"use client";

import { useActionState } from "react";

import { removeGroupMembershipAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { EmptyState } from "@/components/shared/empty-state";
import { TeamCard } from "@/components/tournaments/team-card";
import { Button } from "@/components/ui/button";

type GroupMembershipRow = {
  id: string;
  teamEntry: {
    id: string;
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

type GroupRow = {
  id: string;
  name: string;
  groupOrder: number;
  memberships: GroupMembershipRow[];
};

type GroupsOverviewProps = {
  tournamentId: string;
  categoryId: string;
  groups: GroupRow[];
};

export function GroupsOverview({
  tournamentId,
  categoryId,
  groups,
}: GroupsOverviewProps) {
  if (groups.length === 0) {
    return (
      <EmptyState message="No groups created yet. Add the first group for this category." />
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
      {groups.map((group) => (
        <div key={group.id} className="surface-card overflow-hidden">
          <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <h4 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {group.name}
              </h4>

              <span className="text-xs text-muted-foreground sm:text-sm">
                ⁜
              </span>

              <span className="text-xs text-muted-foreground sm:text-sm">
                Order {group.groupOrder}
              </span>

              <span className="text-xs text-muted-foreground sm:text-sm">
                ⁜
              </span>

              <span className="text-xs text-muted-foreground sm:text-sm">
                {group.memberships.length} teams
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {group.memberships.length === 0 ? (
              <EmptyState message="No teams assigned yet." />
            ) : (
              <div className="space-y-2">
                {group.memberships.map((membership) => (
                  <MembershipCard
                    key={membership.id}
                    tournamentId={tournamentId}
                    categoryId={categoryId}
                    membership={membership}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MembershipCard({
  tournamentId,
  categoryId,
  membership,
}: {
  tournamentId: string;
  categoryId: string;
  membership: GroupMembershipRow;
}) {
  const [state, formAction, isPending] = useActionState(
    removeGroupMembershipAction,
    {
      success: false,
      message: "",
    },
  );

  const team = membership.teamEntry;

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
        badgeLabel="team"
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
          <input type="hidden" name="membershipId" value={membership.id} />
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            disabled={isPending}
          >
            Unassign
          </Button>
        </form>
      </div>
    </div>
  );
}
