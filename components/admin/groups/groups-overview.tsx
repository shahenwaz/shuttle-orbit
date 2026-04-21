"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import {
  deleteGroupAction,
  removeGroupMembershipAction,
  type DeleteGroupActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
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

const initialMembershipState: SimpleGroupActionState = {
  success: false,
  message: "",
};

const initialDeleteGroupState: DeleteGroupActionState = {
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteState, setDeleteState] = useState<DeleteGroupActionState>(
    initialDeleteGroupState,
  );
  const [isDeleting, startDeleteTransition] = useTransition();

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

              <DropdownMenuItem
                onSelect={() => {
                  setDeleteState(initialDeleteGroupState);
                  setIsDeleteOpen(true);
                }}
                className="cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete group
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

      <CreateDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        triggerLabel=""
        hideTrigger
        title="Delete group"
        description="This will only work if the group has no assigned teams."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            startDeleteTransition(async () => {
              const result = await deleteGroupAction(formData);
              setDeleteState(result);

              if (result.success) {
                setIsDeleteOpen(false);
              }
            });
          }}
        >
          <input type="hidden" name="tournamentId" value={tournamentId} />
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="groupId" value={group.id} />

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{group.name}</span>?
          </p>

          {deleteState.message ? (
            <div
              className={`rounded-xl border px-3 py-2 text-sm ${
                deleteState.success
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/20 bg-red-500/10 text-red-300"
              }`}
            >
              {deleteState.message}
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" variant="destructive" disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete group"}
            </Button>
          </div>
        </form>
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
  const [isUnassignOpen, setIsUnassignOpen] = useState(false);
  const [unassignState, setUnassignState] = useState<SimpleGroupActionState>(
    initialMembershipState,
  );
  const [isUnassigning, startUnassignTransition] = useTransition();

  const team = membership.teamEntry;

  return (
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
            <DropdownMenuItem
              onSelect={() => {
                setUnassignState(initialMembershipState);
                setIsUnassignOpen(true);
              }}
              className="cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Unassign team
            </DropdownMenuItem>
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

      <CreateDialog
        open={isUnassignOpen}
        onOpenChange={setIsUnassignOpen}
        triggerLabel=""
        hideTrigger
        title="Unassign team"
        description="This will remove the team from the current group."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            startUnassignTransition(async () => {
              const result = await removeGroupMembershipAction(
                initialMembershipState,
                formData,
              );
              setUnassignState(result);

              if (result.success) {
                setIsUnassignOpen(false);
              }
            });
          }}
        >
          <input type="hidden" name="tournamentId" value={tournamentId} />
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="membershipId" value={membership.id} />

          <p className="text-sm text-muted-foreground">
            Are you sure you want to unassign this team from the group?
          </p>

          {unassignState.message ? (
            <div
              className={`rounded-xl border px-3 py-2 text-sm ${
                unassignState.success
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/20 bg-red-500/10 text-red-300"
              }`}
            >
              {unassignState.message}
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUnassignOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="destructive"
              disabled={isUnassigning}
            >
              {isUnassigning ? "Unassigning..." : "Unassign team"}
            </Button>
          </div>
        </form>
      </CreateDialog>
    </div>
  );
}
