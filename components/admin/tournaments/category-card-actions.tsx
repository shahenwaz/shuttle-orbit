"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { deleteCategoryAction } from "@/app/admin/tournaments/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { EditCategoryForm } from "@/components/admin/tournaments/edit-category-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CategoryCardActionsProps = {
  tournamentId: string;
  category: {
    id: string;
    name: string;
    code: string;
    rulesSummary: string | null;
  };
};

export function CategoryCardActions({
  tournamentId,
  category,
}: CategoryCardActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteError, setDeleteError] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-md text-muted-foreground hover:bg-white/8 hover:text-foreground focus-visible:ring-0"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open category actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-44 rounded-md border border-white/10 bg-[#0b1018]/95 p-1.5 text-foreground shadow-2xl backdrop-blur-xl"
        >
          <DropdownMenuItem
            onSelect={() => setIsEditOpen(true)}
            className="cursor-pointer rounded-md text-sm text-foreground focus:bg-white/8"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit category
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              setDeleteMessage("");
              setDeleteError(false);
              setIsDeleteOpen(true);
            }}
            className="cursor-pointer rounded-md text-sm text-foreground focus:bg-white/8"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        triggerLabel=""
        hideTrigger
        title="Edit category"
        description="Update category details."
      >
        {isEditOpen ? (
          <EditCategoryForm
            tournamentId={tournamentId}
            category={category}
            onSuccess={() => setIsEditOpen(false)}
          />
        ) : null}
      </CreateDialog>

      <CreateDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        triggerLabel=""
        hideTrigger
        title="Delete category"
        description="This will permanently remove the category and all its related stage, group, fixture, and result data."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData();
            formData.set("tournamentId", tournamentId);
            formData.set("categoryId", category.id);

            startDeleteTransition(async () => {
              const result = await deleteCategoryAction(formData);
              setDeleteError(!result.success);
              setDeleteMessage(result.message);

              if (result.success) {
                setIsDeleteOpen(false);
              }
            });
          }}
        >
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{category.name}</span>
            ?
          </p>

          {deleteMessage ? (
            <div
              className={`rounded-md border px-3 py-2 text-sm ${
                deleteError
                  ? "border-red-500/20 bg-red-500/10 text-red-300"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {deleteMessage}
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
              {isDeleting ? "Deleting..." : "Delete category"}
            </Button>
          </div>
        </form>
      </CreateDialog>
    </>
  );
}
