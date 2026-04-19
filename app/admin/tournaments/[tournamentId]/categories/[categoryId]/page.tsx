import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { KnockoutStageSelector } from "@/components/admin/knockout/knockout-stage-selector";
import { getCategoryKnockoutConfig } from "@/lib/tournament-category/knockout-config";

type AdminCategoryPageProps = {
  params: Promise<{
    tournamentId: string;
    categoryId: string;
  }>;
};

export default async function AdminCategoryPage({
  params,
}: AdminCategoryPageProps) {
  const { categoryId } = await params;
  const category = await getCategoryKnockoutConfig(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <section className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
          Admin category
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {category.name}
        </h1>

        <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          Code: {category.code}
        </p>
      </section>

      <KnockoutStageSelector
        initialStageType={
          (category.knockoutStartStage as
            | "quarter_final"
            | "semi_final"
            | "final"
            | null) ?? "semi_final"
        }
      />
    </PageContainer>
  );
}
