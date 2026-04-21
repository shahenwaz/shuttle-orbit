"use client";

import { useActionState, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { removeGroupMembershipAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { EditGroupForm } from "@/components/admin/groups/edit-group-form";
import { EmptyState } from "@/components/shared/empty-state";
import { TeamCard } from "@/components/tournaments/team-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

type SimpleGroupActionState = {
  success: boolean;
  message: string;
};

const initialState: SimpleGroupActionState = {
  success: false,
  message: "",
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
        <GroupCard
          key={group.id}
          tournamentId={tournamentId}
          categoryId={categoryId}
          group={group}
        />
      ))}
    </div>
  );
}

function GroupCard({
  tournamentId,
  categoryId,
  group,
}: {
  tournamentId: string;
  categoryId: string;
  group: GroupRow;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <h4 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
              {group.name}
            </h4>

            <span className="text-xs text-muted-foreground sm:text-sm">⁜</span>

            <span className="text-xs text-muted-foreground sm:text-sm">
              Order {group.groupOrder}
            </span>

            <span className="text-xs text-muted-foreground sm:text-sm">⁜</span>

            <span className="text-xs text-muted-foreground sm:text-sm">
              {group.memberships.length} teams
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open group actions</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setIsEditOpen(true)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      <CreateDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        triggerLabel=""
        hideTrigger
        title="Edit group"
        description="Update the group name or order."
      >
        <EditGroupForm
          tournamentId={tournamentId}
          categoryId={categoryId}
          group={{
            id: group.id,
            name: group.name,
            groupOrder: group.groupOrder,
          }}
        />
      </CreateDialog>
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
  const [state, formAction] = useActionState(
    removeGroupMembershipAction,
    initialState,
  );

  const team = membership.teamEntry;

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <div className="absolute right-2 top-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open membership actions</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <form action={formAction}>
                <input type="hidden" name="tournamentId" value={tournamentId} />
                <input type="hidden" name="categoryId" value={categoryId} />
                <input
                  type="hidden"
                  name="membershipId"
                  value={membership.id}
                />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Unassign team
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
  );
}
