"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { deletePlayerAction } from "@/app/admin/players/actions";
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

export function AdminPlayerCard({ player }: AdminPlayerCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

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

            <form action={deletePlayerAction}>
              <input type="hidden" name="playerId" value={player.id} />
              <DropdownMenuItem asChild className="cursor-pointer">
                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove player
                </button>
              </DropdownMenuItem>
            </form>
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
    </div>
  );
}
