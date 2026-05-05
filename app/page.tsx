import { Medal, Settings2, Users } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { HomeFeatureGrid } from "@/components/public/home-feature-grid";
import { HomeFeaturedTournament } from "@/components/public/home-featured-tournament";
import { HomeStatStrip } from "@/components/public/home-stat-strip";
import { PublicHero } from "@/components/public/public-hero";
import { getFeaturedTournament } from "@/lib/tournament/queries";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ShuttleRank | Badminton Tournaments, Rankings and Results",
  description:
    "ShuttleRank helps communities run badminton tournaments, manage fixtures, track standings, publish results, and build player rankings.",
});

const stats = [
  { label: "Tournament formats", value: "Groups, knockouts, finals" },
  { label: "Player history", value: "Records beyond one event" },
  { label: "Live competition flow", value: "Fixtures, standings, results" },
] as const;

const features = [
  {
    title: "Run flexible badminton tournaments",
    description:
      "Create real community tournament formats with group stages, knockouts, finals, and custom category structures.",
    icon: Settings2,
  },
  {
    title: "Track players beyond one event",
    description:
      "Build long-term player records with participation history, changing partnerships, results, and future ranking potential.",
    icon: Users,
  },
  {
    title: "Publish clear standings and results",
    description:
      "Give players and spectators one clean place to follow fixtures, match scores, group tables, tournament progress, and leaderboards.",
    icon: Medal,
  },
] as const;

export default async function HomePage() {
  const featuredTournament = await getFeaturedTournament();

  type FeaturedTournamentCategory = NonNullable<
    typeof featuredTournament
  >["categories"][number];

  return (
    <PageContainer className="space-y-10 sm:space-y-14">
      <PublicHero
        badge="Introducing ShuttleRank"
        title="Run badminton tournaments with clarity, history, and rankings."
        description="ShuttleRank helps communities manage fixtures, teams, standings, results, player records, and leaderboards through one polished badminton tournament platform."
        primaryHref="/tournaments"
        primaryLabel="Explore tournaments"
        secondaryHref="/leaderboard"
        secondaryLabel="View rankings"
      />

      <HomeStatStrip items={[...stats]} />

      <HomeFeaturedTournament
        tournament={
          featuredTournament
            ? {
                name: featuredTournament.name,
                slug: featuredTournament.slug,
                description: featuredTournament.description,
                eventDate: featuredTournament.eventDate,
                location: featuredTournament.location,
                categories: featuredTournament.categories.map(
                  (category: FeaturedTournamentCategory) => ({
                    id: category.id,
                    code: category.code,
                  }),
                ),
              }
            : null
        }
      />

      <HomeFeatureGrid items={[...features]} />
    </PageContainer>
  );
}
