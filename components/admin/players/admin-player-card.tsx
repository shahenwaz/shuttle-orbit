"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import {
  deletePlayerAction,
  type DeletePlayerActionState,
} from "@/app/admin/players/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { EditPlayerForm } from "@/components/admin/players/edit-player-form";
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
    categoryCodes?: string[];
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
    <div className="rounded-md border border-white/10 bg-white/4 px-3 py-0.5 backdrop-blur-sm transition hover:border-primary/40 hover:bg-white/5 sm:px-3.5 sm:py-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate pr-1 text-[13px] font-bold uppercase tracking-[0.08em] text-purple-400 sm:text-sm">
            {player.fullName}
            <span className="ml-2 font-medium normal-case tracking-normal text-muted-foreground">
              - @{player.nickname}
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {player.categoryCodes && player.categoryCodes.length > 0 ? (
            <span className="max-w-21 truncate text-[12px] font-medium uppercase tracking-[0.16em] text-primary sm:max-w-25 sm:text-[11px]">
              {player.categoryCodes.join(" · ")}
            </span>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7.5 w-7.5 shrink-0 cursor-pointer rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0 sm:h-8 sm:w-8"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open player actions</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-44 rounded-2xl border border-white/10 bg-[#0b1018]/95 p-1.5 text-foreground shadow-2xl backdrop-blur-xl"
            >
              <DropdownMenuItem
                onSelect={() => setIsEditOpen(true)}
                className="cursor-pointer rounded-xl text-sm text-foreground focus:bg-white/8"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit player
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  setDeleteState(initialDeleteState);
                  setIsDeleteOpen(true);
                }}
                className="cursor-pointer rounded-xl text-sm text-foreground focus:bg-white/8"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove player
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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
              className="cursor-pointer"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="destructive"
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? "Removing..." : "Remove player"}
            </Button>
          </div>
        </form>
      </CreateDialog>
    </div>
  );
}
