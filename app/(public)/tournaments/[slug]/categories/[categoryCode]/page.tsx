import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { CategoryTabsView } from "@/components/tournaments/category-tabs-view";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getCategoryByTournamentAndCode } from "@/lib/tournament/queries";

type CategoryDetailPageProps = {
  params: Promise<{
    slug: string;
    categoryCode: string;
  }>;
};

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug, categoryCode } = await params;
  const { tournament, category } = await getCategoryByTournamentAndCode(
    slug,
    categoryCode,
  );

  if (!tournament || !category) {
    return buildPageMetadata({
      title: "Tournament Category",
      description:
        "View category standings, teams, fixtures, and results for this badminton tournament.",
    });
  }

  return buildPageMetadata({
    title: `${category.name} - ${tournament.name}`,
    description:
      category.rulesSummary ||
      `View ${category.name} standings, teams, fixtures, matches, and results from ${tournament.name}.`,
  });
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { slug, categoryCode } = await params;
  const { tournament, category } = await getCategoryByTournamentAndCode(
    slug,
    categoryCode,
  );

  if (!tournament || !category) {
    notFound();
  }

  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <section className="space-y-3 sm:space-y-4">
        <Link
          href={`/tournaments/${tournament.slug}`}
          className={actionPillButtonClassName({
            variant: "neutral",
            className: "gap-1.5 px-3 py-1.5 text-xs sm:text-sm",
          })}
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Back to tournament</span>
        </Link>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
            {tournament.name}
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {category.name}
          </h1>

          {category.rulesSummary ? (
            <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              {category.rulesSummary}
            </p>
          ) : null}
        </div>
      </section>

      <CategoryTabsView category={category} />
    </PageContainer>
  );
}
