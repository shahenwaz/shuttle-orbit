import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { TournamentCategoryCard } from "@/components/tournaments/tournament-category-card";
import { TournamentHero } from "@/components/tournaments/tournament-hero";
import { getTournamentBySlug } from "@/lib/tournament/queries";

type TournamentDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type TournamentDetail = NonNullable<
  Awaited<ReturnType<typeof getTournamentBySlug>>
>;
type TournamentCategoryItem = TournamentDetail["categories"][number];

export default async function TournamentDetailPage({
  params,
}: TournamentDetailPageProps) {
  const { slug } = await params;
  const tournament = await getTournamentBySlug(slug);

  if (!tournament) {
    notFound();
  }

  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <TournamentHero tournament={tournament} />

      <section className="space-y-3 sm:space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Categories
          </h2>
          <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            Open a category to view teams, players, standings, and matches.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {tournament.categories.map((category: TournamentCategoryItem) => (
            <TournamentCategoryCard
              key={category.id}
              tournamentSlug={tournament.slug}
              category={category}
            />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
