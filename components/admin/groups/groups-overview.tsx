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
        <div key={group.id} className="surface-panel p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-foreground">
                  {group.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Order {group.groupOrder}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                <p className="text-xs text-muted-foreground">Teams</p>
                <p className="mt-1 text-base font-semibold">
                  {group.memberships.length}
                </p>
              </div>
            </div>

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
    <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-2.5">
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
        badgeLabel="Group team"
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
            variant="outline"
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
