import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { CategoryTabsView } from "@/components/tournaments/category-tabs-view";
import { Button } from "@/components/ui/button";
import { getCategoryByTournamentAndCode } from "@/lib/tournament/queries";

type CategoryDetailPageProps = {
  params: Promise<{
    slug: string;
    categoryCode: string;
  }>;
};

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
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 rounded-full px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
        >
          <Link href={`/tournaments/${tournament.slug}`}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
            Back to tournament
          </Link>
        </Button>

        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
            {tournament.name}
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
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
