import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Shapes, Trophy } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { PlayerAppearanceCard } from "@/components/players/player-appearance-card";
import { ProfileSummaryCard } from "@/components/players/profile-summary-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getPlayerProfile } from "@/lib/player/queries";
import { MetaInfoPill } from "@/components/shared/meta-info-pill";

type PlayerProfilePageProps = {
  params: Promise<{
    playerId: string;
  }>;
};

export default async function PlayerProfilePage({
  params,
}: PlayerProfilePageProps) {
  const { playerId } = await params;
  const profile = await getPlayerProfile(playerId);

  if (!profile) {
    notFound();
  }

  const { player, appearances, rankingSummary } = profile;

  const uniqueTournaments = new Set(
    appearances.map((entry) => entry.category.tournament.id),
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
        <div className="space-y-1">
          <h2 className="text-base font-semibold tracking-tight sm:text-lg">
            Ranking summary
          </h2>
          <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            Current universal standing and category-based ranking snapshot.
          </p>
        </div>

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
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Tournament appearances
          </h2>
          <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            Teams, categories, and ranking outcomes recorded for this player so
            far.
          </p>
        </div>

        {appearances.length === 0 ? (
          <EmptyState message="No tournament appearances available yet." />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {appearances.map((entry) => (
              <PlayerAppearanceCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
