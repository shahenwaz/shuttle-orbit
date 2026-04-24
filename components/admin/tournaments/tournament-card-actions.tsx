"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { deleteTournamentAction } from "@/app/admin/tournaments/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { EditTournamentForm } from "@/components/admin/tournaments/edit-tournament-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TournamentCardActionsProps = {
  tournament: {
    id: string;
    name: string;
    location: string | null;
    eventDate: Date;
    description: string | null;
    categoryCount: number;
  };
};

type DeleteTournamentResult = {
  success: boolean;
  message: string;
};

const initialDeleteState: DeleteTournamentResult = {
  success: false,
  message: "",
};

export function TournamentCardActions({
  tournament,
}: TournamentCardActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteState, setDeleteState] =
    useState<DeleteTournamentResult>(initialDeleteState);
  const [isDeleting, startDeleteTransition] = useTransition();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 cursor-pointer rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open tournament actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onSelect={() => setIsEditOpen(true)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit tournament
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              setDeleteState(initialDeleteState);
              setIsDeleteOpen(true);
            }}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete tournament
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        triggerLabel=""
        hideTrigger
        title="Edit tournament"
        description="Update tournament details and mark it completed when finished."
      >
        <EditTournamentForm
          tournament={{
            id: tournament.id,
            name: tournament.name,
            location: tournament.location,
            eventDate: tournament.eventDate,
            description: tournament.description,
          }}
        />
      </CreateDialog>

      <CreateDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        triggerLabel=""
        hideTrigger
        title="Delete tournament"
        description="This only works if the tournament has no categories."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData();
            formData.set("tournamentId", tournament.id);

            startDeleteTransition(async () => {
              const result = await deleteTournamentAction(formData);
              setDeleteState(result);

              if (result.success) {
                setIsDeleteOpen(false);
              }
            });
          }}
        >
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {tournament.name}
            </span>
            ?
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
              {isDeleting ? "Deleting..." : "Delete tournament"}
            </Button>
          </div>
        </form>
      </CreateDialog>
    </>
  );
}
