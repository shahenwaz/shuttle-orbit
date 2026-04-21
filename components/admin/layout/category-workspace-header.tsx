import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CategoryOpsNav } from "@/components/admin/categories/category-ops-nav";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";

type CategoryWorkspaceHeaderProps = {
  tournamentId: string;
  categoryId: string;
  tournamentName: string;
  categoryName: string;
  description: string;
  activeTab: "teams" | "groups" | "fixtures" | "results";
  stats?: React.ReactNode;
  actions?: React.ReactNode;
};

export function CategoryWorkspaceHeader({
  tournamentId,
  categoryId,
  tournamentName,
  categoryName,
  description,
  activeTab,
  stats,
  actions,
}: CategoryWorkspaceHeaderProps) {
  return (
    <section className="space-y-4 sm:space-y-5">
      <Button
        asChild
        variant="outline"
        size="sm"
        className={actionPillButtonClassName({
          variant: "neutral",
          className: "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
        })}
      >
        <Link href={`/admin/tournaments/${tournamentId}`}>
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          Back to tournament
        </Link>
      </Button>

      <CategoryOpsNav
        tournamentId={tournamentId}
        categoryId={categoryId}
        activeTab={activeTab}
      />

      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
          {tournamentName}
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {categoryName}
        </h1>

        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      {stats || actions ? (
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          {stats ? (
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {stats}
            </div>
          ) : (
            <div />
          )}

          {actions ? (
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
