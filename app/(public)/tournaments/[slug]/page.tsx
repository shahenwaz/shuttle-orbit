import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { PublicTournamentCategoryCard } from "@/components/public/public-tournament-category-card";
import { TournamentHero } from "@/components/tournaments/tournament-hero";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getTournamentBySlug,
  getTournamentMetadataBySlug,
} from "@/lib/tournament/queries";

type TournamentDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: TournamentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tournament = await getTournamentMetadataBySlug(slug);

  if (!tournament) {
    return buildPageMetadata({
      title: "Tournament",
      description:
        "View badminton tournament details, categories, fixtures, standings, and results.",
    });
  }

  return buildPageMetadata({
    title: tournament.name,
    description:
      tournament.description ||
      `View ${tournament.name} tournament details, categories, fixtures, standings, and results.`,
  });
}

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
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {tournament.categories.map((category: TournamentCategoryItem) => (
            <PublicTournamentCategoryCard
              key={category.id}
              category={category}
              href={`/tournaments/${tournament.slug}/categories/${category.code}`}
            />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
