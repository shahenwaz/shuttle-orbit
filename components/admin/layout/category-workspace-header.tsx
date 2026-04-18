import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CategoryOpsNav } from "@/components/admin/categories/category-ops-nav";
import { CompactStatRow } from "@/components/shared/compact-stat-row";
import { Button } from "@/components/ui/button";

type CategoryWorkspaceHeaderProps = {
  tournamentId: string;
  categoryId: string;
  categoryName: string;
  tournamentName: string;
  description: string;
  activeTab: "teams" | "groups" | "fixtures" | "results";
  stats?: React.ReactNode;
  actions?: React.ReactNode;
};

export function CategoryWorkspaceHeader({
  tournamentId,
  categoryId,
  categoryName,
  tournamentName,
  description,
  activeTab,
  stats,
  actions,
}: CategoryWorkspaceHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/tournaments/${tournamentId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tournament
          </Link>
        </Button>
      </div>

      <CategoryOpsNav
        tournamentId={tournamentId}
        categoryId={categoryId}
        activeTab={activeTab}
      />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <div className="inline-flex rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            {tournamentName}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {categoryName}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>
        </div>

        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>

      {stats ? <CompactStatRow>{stats}</CompactStatRow> : null}
    </section>
  );
}
