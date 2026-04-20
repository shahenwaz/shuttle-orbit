"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import {
  deletePlayerAction,
  type DeletePlayerActionState,
} from "@/app/admin/players/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { EditPlayerForm } from "@/components/admin/players/edit-player-form";
import { PlayerCard } from "@/components/tournaments/player-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AdminPlayerCardProps = {
  player: {
    id: string;
    fullName: string;
    nickname: string;
  };
};

const initialDeleteState: DeletePlayerActionState = {
  success: false,
  message: "",
};

export function AdminPlayerCard({ player }: AdminPlayerCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteState, setDeleteState] =
    useState<DeletePlayerActionState>(initialDeleteState);
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
              <span className="sr-only">Open player actions</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onSelect={() => setIsEditOpen(true)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit player
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => {
                setDeleteState(initialDeleteState);
                setIsDeleteOpen(true);
              }}
              className="cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove player
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <PlayerCard player={player} />

      <CreateDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        triggerLabel=""
        hideTrigger
        title="Edit player"
        description="Update the player details."
      >
        <EditPlayerForm
          player={player}
          onSuccess={() => setIsEditOpen(false)}
        />
      </CreateDialog>

      <CreateDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        triggerLabel=""
        hideTrigger
        title="Remove player"
        description="This will only work if the player has not been used in any team or tournament history."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            startDeleteTransition(async () => {
              const result = await deletePlayerAction(formData);
              setDeleteState(result);

              if (result.success) {
                setIsDeleteOpen(false);
              }
            });
          }}
        >
          <input type="hidden" name="playerId" value={player.id} />

          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">
              {player.fullName}
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
              {isDeleting ? "Removing..." : "Remove player"}
            </Button>
          </div>
        </form>
      </CreateDialog>
    </div>
  );
}
