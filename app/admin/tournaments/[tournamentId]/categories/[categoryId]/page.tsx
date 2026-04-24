import { notFound } from "next/navigation";
import { GitBranch } from "lucide-react";

import { CategoryWorkspaceHeader } from "@/components/admin/layout/category-workspace-header";
import { KnockoutStageSelector } from "@/components/admin/knockout/knockout-stage-selector";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";
import { getCategoryKnockoutConfig } from "@/lib/tournament-category/knockout-config";
import type { KnockoutStageType } from "@/lib/knockout/types";

type AdminCategoryPageProps = {
  params: Promise<{
    tournamentId: string;
    categoryId: string;
  }>;
};

function getKnockoutLabel(stage: KnockoutStageType | null) {
  switch (stage) {
    case "quarter_final":
      return "Quarter final";
    case "semi_final":
      return "Semi final";
    case "final":
      return "Final";
    default:
      return "Not set";
  }
}

export default async function AdminCategoryPage({
  params,
}: AdminCategoryPageProps) {
  const { tournamentId, categoryId } = await params;

  const [tournament, category] = await Promise.all([
    prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: {
        id: true,
        name: true,
      },
    }),
    getCategoryKnockoutConfig(categoryId),
  ]);

  if (!tournament || !category) {
    notFound();
  }

  const currentStartStage =
    (category.knockoutStartStage as KnockoutStageType | null) ?? null;

  return (
    <PageContainer className="space-y-6">
      <CategoryWorkspaceHeader
        tournamentId={tournament.id}
        categoryId={category.id}
        tournamentName={tournament.name}
        categoryName={`${category.name} knockout`}
        description="Choose where the knockout bracket should begin for this category, then generate and manage the bracket from Fixtures."
        activeTab="fixtures"
        stats={
          <>
            <CompactStatPill label="Category" value={category.name} />
            <CompactStatPill
              label="Start stage"
              value={getKnockoutLabel(currentStartStage)}
            />
          </>
        }
        actions={
          <div className="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-medium text-violet-100 sm:px-3 sm:py-1.5 sm:text-[11px]">
            <GitBranch className="h-3.5 w-3.5" />
            Bracket setup
          </div>
        }
      />

      <KnockoutStageSelector
        tournamentId={tournamentId}
        categoryId={categoryId}
        currentStartStageType={currentStartStage}
      />
    </PageContainer>
  );
}
