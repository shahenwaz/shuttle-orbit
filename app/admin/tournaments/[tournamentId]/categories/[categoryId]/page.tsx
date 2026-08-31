import { notFound } from "next/navigation";
import { GitBranch } from "lucide-react";

import { CategoryWorkspaceHeader } from "@/components/admin/layout/category-workspace-header";
import { KnockoutStageSelector } from "@/components/admin/knockout/knockout-stage-selector";
import { PageContainer } from "@/components/layout/page-container";
import { getCategoryKnockoutConfig } from "@/lib/tournament-category/knockout-config";
import type { KnockoutStageType } from "@/lib/knockout/types";

type AdminCategoryPageProps = {
  params: Promise<{
    tournamentId: string;
    categoryId: string;
  }>;
};

function getIncludeThirdPlace(config: unknown) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return false;
  }

  return (config as { includeThirdPlace?: unknown }).includeThirdPlace === true;
}

export default async function AdminCategoryPage({
  params,
}: AdminCategoryPageProps) {
  const { tournamentId, categoryId } = await params;

  const category = await getCategoryKnockoutConfig(categoryId, tournamentId);

  if (!category) {
    notFound();
  }

  const tournament = category.tournament;

  const currentStartStage =
    (category.knockoutStartStage as KnockoutStageType | null) ?? null;

  const currentIncludeThirdPlace = getIncludeThirdPlace(
    category.knockoutConfig,
  );

  return (
    <>
      <CategoryWorkspaceHeader
        tournamentId={tournament.id}
        categoryId={category.id}
        tournamentName={tournament.name}
        categoryName={`${category.name} bracket setup`}
        description="Choose where the knockout bracket should begin for this category, then generate and manage the bracket from Fixtures."
        activeTab="bracket"
        actions={
          <div className="inline-flex items-center gap-1 rounded-sm border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-medium text-violet-100 sm:px-3 sm:py-1.5 sm:text-[11px]">
            <GitBranch className="h-3.5 w-3.5" />
            Bracket setup
          </div>
        }
      />

      <PageContainer className="pt-4 pb-4 sm:pt-5 sm:pb-5">
        <KnockoutStageSelector
          tournamentId={tournamentId}
          categoryId={categoryId}
          currentStartStageType={currentStartStage}
          currentIncludeThirdPlace={currentIncludeThirdPlace}
        />
      </PageContainer>
    </>
  );
}
