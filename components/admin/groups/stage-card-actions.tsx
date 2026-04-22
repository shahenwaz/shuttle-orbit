"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { deleteCategoryStageAction } from "@/app/admin/tournaments/[tournamentId]/categories/[categoryId]/groups/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { EditStageForm } from "@/components/admin/groups/edit-stage-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type StageCardActionsProps = {
  tournamentId: string;
  categoryId: string;
  stageId: string;
  stageName: string;
};

type DeleteStageActionState = {
  success: boolean;
  message: string;
};

const initialState: DeleteStageActionState = {
  success: false,
  message: "",
};

export function StageCardActions({
  tournamentId,
  categoryId,
  stageId,
  stageName,
}: StageCardActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteState, setDeleteState] =
    useState<DeleteStageActionState>(initialState);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open stage actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onSelect={() => setIsEditOpen(true)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit stage
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              setDeleteState(initialState);
              setIsDeleteOpen(true);
            }}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete stage
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        triggerLabel=""
        hideTrigger
        title="Edit stage"
        description="Rename this stage."
      >
        <EditStageForm
          tournamentId={tournamentId}
          categoryId={categoryId}
          stage={{
            id: stageId,
            name: stageName,
          }}
          onSuccess={() => setIsEditOpen(false)}
        />
      </CreateDialog>

      <CreateDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        triggerLabel=""
        hideTrigger
        title="Delete stage"
        description="This only works if the stage has no groups or matches."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData();
            formData.set("tournamentId", tournamentId);
            formData.set("categoryId", categoryId);
            formData.set("stageId", stageId);

            startDeleteTransition(async () => {
              const result = await deleteCategoryStageAction(formData);
              setDeleteState(result);

              if (result.success) {
                setIsDeleteOpen(false);
              }
            });
          }}
        >
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{stageName}</span>?
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
              {isDeleting ? "Deleting..." : "Delete stage"}
            </Button>
          </div>
        </form>
      </CreateDialog>
    </>
  );
}
