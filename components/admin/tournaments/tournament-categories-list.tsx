"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  FolderKanban,
  LayoutGrid,
  Pencil,
  Swords,
  Users,
  GitBranch,
  MoreVertical,
  Trash2,
} from "lucide-react";

import { deleteCategoryAction } from "@/app/admin/tournaments/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { EditCategoryForm } from "@/components/admin/tournaments/edit-category-form";
import { EmptyState } from "@/components/shared/empty-state";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TournamentCategoryRow = {
  id: string;
  name: string;
  code: string;
  rulesSummary: string | null;
  status: string;
  stages: Array<{
    id: string;
    groups: Array<{
      id: string;
    }>;
  }>;
  _count: {
    teamEntries: number;
    matches: number;
  };
};

type TournamentCategoriesListProps = {
  tournamentId: string;
  categories: TournamentCategoryRow[];
};

export function TournamentCategoriesList({
  tournamentId,
  categories,
}: TournamentCategoriesListProps) {
  if (categories.length === 0) {
    return (
      <EmptyState message="No categories added yet. Add the first category for this tournament." />
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {categories.map((category) => {
        const totalGroups = category.stages.reduce(
          (sum, stage) => sum + stage.groups.length,
          0,
        );

        return (
          <div key={category.id} className="surface-card p-4 sm:p-5">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div className="min-w-0 space-y-2">
                  <h4 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    {category.name}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    {category.rulesSummary || "No rules summary added yet."}
                  </p>
                </div>

                <CategoryCardActions
                  tournamentId={tournamentId}
                  categoryId={category.id}
                  categoryName={category.name}
                />
              </div>

              <CompactStatRow className="justify-start">
                <CompactStatPill label="Groups" value={totalGroups} />
                <CompactStatPill
                  label="Teams"
                  value={category._count.teamEntries}
                />
                <CompactStatPill
                  label="Matches"
                  value={category._count.matches}
                />
              </CompactStatRow>

              <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                <CreateDialog
                  triggerLabel="Edit"
                  title="Edit category"
                  description="Update category details."
                  triggerClassName={actionPillButtonClassName({
                    variant: "edit",
                    className: "w-full justify-center sm:w-auto",
                  })}
                  triggerIcon={<Pencil className="h-3.5 w-3.5" />}
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

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={actionPillButtonClassName({
                    variant: "link",
                    className: "w-full justify-center sm:w-auto",
                  })}
                >
                  <Link
                    href={`/admin/tournaments/${tournamentId}/categories/${category.id}`}
                  >
                    <GitBranch className="mr-1 h-3.5 w-3.5" />
                    Knockout
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={actionPillButtonClassName({
                    variant: "link",
                    className: "w-full justify-center sm:w-auto",
                  })}
                >
                  <Link
                    href={`/admin/tournaments/${tournamentId}/categories/${category.id}/groups`}
                  >
                    <FolderKanban className="mr-1 h-3.5 w-3.5" />
                    Groups
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={actionPillButtonClassName({
                    variant: "link",
                    className: "w-full justify-center sm:w-auto",
                  })}
                >
                  <Link
                    href={`/admin/tournaments/${tournamentId}/categories/${category.id}/fixtures`}
                  >
                    <LayoutGrid className="mr-1 h-3.5 w-3.5" />
                    Fixtures
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={actionPillButtonClassName({
                    variant: "link",
                    className: "w-full justify-center sm:w-auto",
                  })}
                >
                  <Link
                    href={`/admin/tournaments/${tournamentId}/categories/${category.id}/results`}
                  >
                    <Swords className="mr-1 h-3.5 w-3.5" />
                    Results
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={actionPillButtonClassName({
                    variant: "create",
                    className: "w-full justify-center sm:w-auto",
                  })}
                >
                  <Link
                    href={`/admin/tournaments/${tournamentId}/categories/${category.id}/teams`}
                  >
                    <Users className="mr-1 h-3.5 w-3.5" />
                    Teams
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CategoryCardActions({
  tournamentId,
  categoryId,
  categoryName,
}: {
  tournamentId: string;
  categoryId: string;
  categoryName: string;
}) {
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
            className="h-8 w-8 shrink-0 cursor-pointer rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open category actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onSelect={() => {
              setDeleteMessage("");
              setDeleteError(false);
              setIsDeleteOpen(true);
            }}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
            formData.set("categoryId", categoryId);

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
            <span className="font-medium text-foreground">{categoryName}</span>?
          </p>

          {deleteMessage ? (
            <div
              className={`rounded-xl border px-3 py-2 text-sm ${
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
