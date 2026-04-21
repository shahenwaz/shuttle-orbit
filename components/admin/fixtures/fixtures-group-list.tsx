"use client";

import { useActionState, useState, useTransition } from "react";
import { CalendarPlus, MoreVertical, RotateCcw, Trash2 } from "lucide-react";

import {
  deleteMatchAction,
  type DeleteMatchActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/fixtures/actions";
import { resetGroupFixturesAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { CreateSheet } from "@/components/admin/create-sheet";
import { CreateGroupMatchForm } from "@/components/admin/fixtures/create-group-match-form";
import { EmptyState } from "@/components/shared/empty-state";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { MatchCard } from "@/components/tournaments/match-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  memberships: Array<{
    id: string;
    teamEntry?: {
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
  }>;
  matches: MatchRow[];
};

type FixturesGroupListProps = {
  tournamentId: string;
  categoryId: string;
  groups: GroupFixtureRow[];
};

const initialDeleteMatchState: DeleteMatchActionState = {
  success: false,
  message: "",
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

  const teamOptions = group.memberships
    .filter((membership) => membership.teamEntry)
    .map((membership) => {
      const team = membership.teamEntry!;
      return {
        id: team.id,
        label: formatTeamName(
          team.player1.fullName,
          team.player2.fullName,
          team.teamName,
        ),
      };
    });

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-col gap-2 sm:gap-3">
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

          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            <CreateSheet
              triggerLabel="Add match"
              title="Create match"
              description="Create a manual match for this group."
              triggerClassName={actionPillButtonClassName({
                variant: "create",
                className:
                  "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
              })}
              triggerIcon={<CalendarPlus className="h-3.5 w-3.5" />}
            >
              <CreateGroupMatchForm
                tournamentId={tournamentId}
                categoryId={categoryId}
                groupId={group.id}
                teams={teamOptions}
              />
            </CreateSheet>

            <form action={formAction}>
              <input type="hidden" name="tournamentId" value={tournamentId} />
              <input type="hidden" name="categoryId" value={categoryId} />
              <input type="hidden" name="groupId" value={group.id} />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={isPending || group.matches.length === 0}
                className={actionPillButtonClassName({
                  variant: "neutral",
                  className:
                    "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
                })}
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                Reset fixtures
              </Button>
            </form>
          </div>
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
          <div className="grid gap-1.5 sm:gap-2 xl:grid-cols-2">
            {group.matches.map((match) => (
              <FixtureMatchCard
                key={match.id}
                tournamentId={tournamentId}
                categoryId={categoryId}
                match={match}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FixtureMatchCard({
  tournamentId,
  categoryId,
  match,
}: {
  tournamentId: string;
  categoryId: string;
  match: MatchRow;
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteState, setDeleteState] = useState<DeleteMatchActionState>(
    initialDeleteMatchState,
  );
  const [isDeleting, startDeleteTransition] = useTransition();

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
              <span className="sr-only">Open match actions</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onSelect={() => {
                setDeleteState(initialDeleteMatchState);
                setIsDeleteOpen(true);
              }}
              className="cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove match
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <MatchCard match={match} />

      <CreateDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        triggerLabel=""
        hideTrigger
        title="Remove match"
        description="This only works if no result has been recorded for the match."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            startDeleteTransition(async () => {
              const result = await deleteMatchAction(formData);
              setDeleteState(result);

              if (result.success) {
                setIsDeleteOpen(false);
              }
            });
          }}
        >
          <input type="hidden" name="tournamentId" value={tournamentId} />
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="matchId" value={match.id} />

          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove this match?
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
              {isDeleting ? "Removing..." : "Remove match"}
            </Button>
          </div>
        </form>
      </CreateDialog>
    </div>
  );
}
