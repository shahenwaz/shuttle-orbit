"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Trash2 } from "lucide-react";

import {
  removeTeamEntryAction,
  type RemoveTeamEntryActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/teams/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { TeamCard } from "@/components/tournaments/team-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const initialDeleteState: RemoveTeamEntryActionState = {
  success: false,
  message: "",
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
        <AdminTeamEntryCard
          key={team.id}
          tournamentId={tournamentId}
          categoryId={categoryId}
          team={team}
        />
      ))}
    </div>
  );
}

function AdminTeamEntryCard({
  tournamentId,
  categoryId,
  team,
}: {
  tournamentId: string;
  categoryId: string;
  team: TeamEntryRow;
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteState, setDeleteState] =
    useState<RemoveTeamEntryActionState>(initialDeleteState);
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
              <span className="sr-only">Open team actions</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onSelect={() => {
                setDeleteState(initialDeleteState);
                setIsDeleteOpen(true);
              }}
              className="cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove team
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
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        triggerLabel=""
        hideTrigger
        title="Remove team"
        description="This will only work if the team is not assigned to any group yet."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            startDeleteTransition(async () => {
              const result = await removeTeamEntryAction(formData);
              setDeleteState(result);

              if (result.success) {
                setIsDeleteOpen(false);
              }
            });
          }}
        >
          <input type="hidden" name="tournamentId" value={tournamentId} />
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="teamEntryId" value={team.id} />

          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove this team?
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
              {isDeleting ? "Removing..." : "Remove team"}
            </Button>
          </div>
        </form>
      </CreateDialog>
    </div>
  );
}
