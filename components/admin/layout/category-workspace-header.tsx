import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  CategoryOpsNav,
  type CategoryOpsTab,
} from "@/components/admin/categories/category-ops-nav";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { HeaderSurface } from "@/components/shared/header-surface";
import { Button } from "@/components/ui/button";

type CategoryWorkspaceHeaderProps = {
  tournamentId: string;
  categoryId: string;
  tournamentName: string;
  categoryName: string;
  description?: string;
  activeTab: CategoryOpsTab;
  actions?: React.ReactNode;
};

export function CategoryWorkspaceHeader({
  tournamentId,
  categoryId,
  tournamentName,
  categoryName,
  activeTab,
  actions,
}: CategoryWorkspaceHeaderProps) {
  return (
    <HeaderSurface
      title={categoryName}
      variant="tournament"
      meta={
        <>
          <span className="shrink-0 font-semibold text-primary">
            {tournamentName}
          </span>
        </>
      }
      actions={
        <>
          <Button
            asChild
            variant="outline"
            size="sm"
            className={actionPillButtonClassName({
              variant: "neutral",
              className:
                "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
            })}
          >
            <Link href={`/admin/tournaments/${tournamentId}`}>
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              Back
            </Link>
          </Button>

          {actions}
        </>
      }
    >
      <CategoryOpsNav
        tournamentId={tournamentId}
        categoryId={categoryId}
        activeTab={activeTab}
      />
    </HeaderSurface>
  );
}
