import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { ArrowLeft, Shapes, Trophy } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { PlayerAppearanceCard } from "@/components/players/player-appearance-card";
import { ProfileSummaryCard } from "@/components/players/profile-summary-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getPlayerProfile } from "@/lib/player/queries";
import { MetaInfoPill } from "@/components/shared/meta-info-pill";
import { SectionIntro } from "@/components/shared/section-intro";

type PlayerProfilePageProps = {
  params: Promise<{
    playerId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PlayerProfilePageProps): Promise<Metadata> {
  const { playerId } = await params;
  const profile = await getPlayerProfile(playerId);

  if (!profile) {
    return buildPageMetadata({
      title: "Player Profile",
      description:
        "View badminton player profile, tournament appearances, ranking summary, and match history.",
    });
  }

  return buildPageMetadata({
    title: profile.player.fullName,
    description: `View ${profile.player.fullName}'s badminton player profile, tournament appearances, ranking summary, and match history.`,
  });
}

export default async function PlayerProfilePage({
  params,
}: PlayerProfilePageProps) {
  const { playerId } = await params;
  const profile = await getPlayerProfile(playerId);

  if (!profile) {
    notFound();
  }

  const { player, appearances, rankingSummary } = profile;

  type PlayerAppearance = (typeof appearances)[number];

  const uniqueTournaments = new Set(
    appearances.map((entry: PlayerAppearance) => entry.category.tournament.id),
  ).size;

  const bestCategoryEntry = rankingSummary.categoryRankings[0] ?? null;
  const bestCategoryDisplay = bestCategoryEntry
    ? `${bestCategoryEntry.categoryCode} · #${bestCategoryEntry.rank ?? "—"}`
    : "—";

  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <section className="space-y-3 sm:space-y-4">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 rounded-full px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
        >
          <Link href="/players">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
            Back to players
          </Link>
        </Button>

        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
            Player profile
          </p>

          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {player.fullName}
            </h1>
            <span className="text-xs font-medium text-muted-foreground sm:text-sm">
              @{player.nickname}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <MetaInfoPill icon={Shapes}>
            {appearances.length} appearance
            {appearances.length === 1 ? "" : "s"}
          </MetaInfoPill>

          <MetaInfoPill icon={Trophy}>
            {uniqueTournaments} tournament
            {uniqueTournaments === 1 ? "" : "s"}
          </MetaInfoPill>
        </div>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <SectionIntro
          title="Ranking summary"
          description="Current universal standing and category-based ranking snapshot."
          descriptionClassName="max-w-2xl"
        />

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          <ProfileSummaryCard
            label="Rank"
            value={rankingSummary.universalRank ?? "—"}
          />

          <ProfileSummaryCard
            label="Points"
            value={rankingSummary.universalPoints}
          />

          <ProfileSummaryCard label="Best" value={bestCategoryDisplay} />
        </div>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <SectionIntro
          title="Tournament appearances"
          description="Teams, categories, and ranking outcomes recorded for this player so far."
          titleClassName="text-lg sm:text-xl"
        />

        {appearances.length === 0 ? (
          <EmptyState message="No tournament appearances available yet." />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {appearances.map((entry: PlayerAppearance) => (
              <PlayerAppearanceCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
