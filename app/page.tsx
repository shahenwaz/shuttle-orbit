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
  title: "Community Badminton Tournaments, Fixtures, Rankings and Results",
  description:
    "Follow community badminton tournaments, fixtures, standings, results, player records, and rankings through one modern tournament platform.",
});

const stats = [
  { label: "Flexible formats", value: "Groups, knockouts, finals" },
  { label: "Built for doubles", value: "Persistent player history" },
  { label: "Community-ready", value: "Fixtures, results, standings" },
] as const;

const features = [
  {
    title: "Flexible tournament formats",
    description:
      "From group stages to knockouts and finals, each event can be structured to match the format your community needs.",
    icon: Settings2,
  },
  {
    title: "Player records that continue across events",
    description:
      "Keep track of participation, changing partnerships, and tournament history as players return for future competitions.",
    icon: Users,
  },
  {
    title: "Clear public results and standings",
    description:
      "Players and spectators can easily follow fixtures, standings, match outcomes, and tournament progress in one place.",
    icon: Medal,
  },
] as const;

export default async function HomePage() {
  const featuredTournament = await getFeaturedTournament();

  return (
    <PageContainer className="space-y-10 sm:space-y-14">
      <PublicHero
        badge="Community badminton tournaments made easier"
        title="Run tournaments smoothly. Keep player history beyond a single event."
        description="Manage fixtures, standings, results, and player records through a polished badminton tournament experience built for real community events."
        primaryHref="/tournaments"
        primaryLabel="Explore tournaments"
        secondaryHref="/leaderboard"
        secondaryLabel="View leaderboard"
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
                categories: featuredTournament.categories.map((category) => ({
                  id: category.id,
                  code: category.code,
                })),
              }
            : null
        }
      />

      <HomeFeatureGrid items={[...features]} />
    </PageContainer>
  );
}
