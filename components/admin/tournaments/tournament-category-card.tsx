"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowRight, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { deleteCategoryAction } from "@/app/admin/tournaments/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { EditCategoryForm } from "@/components/admin/tournaments/edit-category-form";
import type { TournamentCategoryRow } from "@/components/admin/tournaments/tournament-categories-list";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TournamentCategoryCardProps = {
  tournamentId: string;
  category: TournamentCategoryRow;
};

export function TournamentCategoryCard({
  tournamentId,
  category,
}: TournamentCategoryCardProps) {
  const totalGroups = category.stages.reduce(
    (sum: number, stage: TournamentCategoryRow["stages"][number]) =>
      sum + stage.groups.length,
    0,
  );

  return (
    <article className="group relative overflow-hidden rounded-md border border-white/10 bg-white/4 px-4 py-3 transition hover:border-emerald-400/25 hover:bg-white/6">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-emerald-300 via-primary to-cyan-500 opacity-75 transition group-hover:opacity-100" />

      <div className="flex flex-col gap-2.5 pl-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <h3 className="truncate text-base font-semibold tracking-tight text-foreground">
            {category.name}
          </h3>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">
                {totalGroups}
              </span>{" "}
              groups
            </span>

            <span className="text-white/20">•</span>

            <span>
              <span className="font-semibold text-foreground">
                {category._count.teamEntries}
              </span>{" "}
              teams
            </span>

            <span className="text-white/20">•</span>

            <span>
              <span className="font-semibold text-foreground">
                {category._count.matches}
              </span>{" "}
              matches
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-white/8 pt-2 sm:border-t-0 sm:pt-0">
          <Link
            href={`/admin/tournaments/${tournamentId}/categories/${category.id}/fixtures`}
            className="inline-flex h-8 items-center justify-center rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 text-xs font-semibold text-emerald-100 transition hover:border-emerald-300/35 hover:bg-emerald-300/15"
          >
            Manage
            <ArrowRight className="ml-1.5 size-3.5" />
          </Link>

          <CategoryCardActions
            tournamentId={tournamentId}
            category={{
              id: category.id,
              name: category.name,
              code: category.code,
              rulesSummary: category.rulesSummary,
            }}
          />
        </div>
      </div>
    </article>
  );
}

function CategoryCardActions({
  tournamentId,
  category,
}: {
  tournamentId: string;
  category: {
    id: string;
    name: string;
    code: string;
    rulesSummary: string | null;
  };
}) {
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
        <EditCategoryForm
          tournamentId={tournamentId}
          category={{
            id: category.id,
            name: category.name,
            code: category.code,
            rulesSummary: category.rulesSummary,
          }}
        />
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
