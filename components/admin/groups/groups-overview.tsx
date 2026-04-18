"use client";

import { useActionState } from "react";

import { removeGroupMembershipAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { Button } from "@/components/ui/button";
import { formatTeamName } from "@/lib/utils/format";

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
      <p className="text-sm text-muted-foreground">
        No groups created yet. Add the first group for this category.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
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
              <p className="text-sm text-muted-foreground">
                No teams assigned yet.
              </p>
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
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="font-medium text-foreground">
            {formatTeamName(
              team.player1.fullName,
              team.player2.fullName,
              team.teamName,
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            @{team.player1.nickname} · @{team.player2.nickname}
          </p>
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
