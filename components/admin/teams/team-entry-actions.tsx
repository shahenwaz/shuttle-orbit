"use client";

import { useState, useTransition } from "react";
import { Edit3, MoreVertical, Trash2 } from "lucide-react";

import {
  removeTeamEntryAction,
  updateTeamEntryNameAction,
  type RemoveTeamEntryActionState,
  type UpdateTeamEntryNameActionState,
} from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/teams/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TeamEntryActionsProps = {
  tournamentId: string;
  categoryId: string;
  team: {
    id: string;
    teamName: string | null;
  };
};

const initialDeleteState: RemoveTeamEntryActionState = {
  success: false,
  message: "",
};

const initialEditState: UpdateTeamEntryNameActionState = {
  success: false,
  message: "",
};

export function TeamEntryActions({
  tournamentId,
  categoryId,
  team,
}: TeamEntryActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteState, setDeleteState] =
    useState<RemoveTeamEntryActionState>(initialDeleteState);
  const [editState, setEditState] =
    useState<UpdateTeamEntryNameActionState>(initialEditState);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isEditing, startEditTransition] = useTransition();

  return (
    <>
      <div className="absolute right-2 top-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open team actions</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onSelect={() => {
                setEditState(initialEditState);
                setIsEditOpen(true);
              }}
              className="cursor-pointer"
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Edit team
            </DropdownMenuItem>

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

      <CreateDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        triggerLabel=""
        hideTrigger
        title="Edit team name"
        description="Update the display name for this team."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            startEditTransition(async () => {
              const result = await updateTeamEntryNameAction(formData);
              setEditState(result);

              if (result.success) {
                setIsEditOpen(false);
              }
            });
          }}
        >
          <input type="hidden" name="tournamentId" value={tournamentId} />
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="teamEntryId" value={team.id} />

          <div className="space-y-2">
            <label
              htmlFor={`team-name-${team.id}`}
              className="text-sm font-medium text-foreground"
            >
              Team name
            </label>
            <Input
              id={`team-name-${team.id}`}
              name="teamName"
              defaultValue={team.teamName ?? ""}
              placeholder="Enter team name"
              maxLength={60}
            />
          </div>

          {editState.message ? (
            <div
              className={`rounded-xl border px-3 py-2 text-sm ${
                editState.success
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/20 bg-red-500/10 text-red-300"
              }`}
            >
              {editState.message}
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isEditing}>
              {isEditing ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CreateDialog>

      <CreateDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        triggerLabel=""
        hideTrigger
        title="Remove team"
        description="The team must not be assigned to a group or used by fixtures or results."
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
    </>
  );
}
