import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Shapes } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/shared/empty-state";
import { TeamCard } from "@/components/tournaments/team-card";
import { Button } from "@/components/ui/button";
import { getPlayerProfile } from "@/lib/player/queries";
import { formatDate } from "@/lib/utils/format";

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

  const { player, appearances } = profile;

  const uniqueCategories = new Set(
    appearances.map((entry) => entry.category.id),
  ).size;

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
          <p className="text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
            Player profile
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {player.fullName}
            <span className="pl-2 text-sm font-medium text-muted-foreground sm:text-base">
              @{player.nickname}
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground sm:text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/50 px-2.5 py-1.5">
            <Shapes className="h-3.5 w-3.5" />
            {appearances.length} appearance
            {appearances.length === 1 ? "" : "s"}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/50 px-2.5 py-1.5">
            {uniqueCategories} categorie{uniqueCategories === 1 ? "y" : "s"}
          </span>
        </div>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Tournament appearances
          </h2>
          <p className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            Teams and categories this player has appeared in so far.
          </p>
        </div>

        {appearances.length === 0 ? (
          <EmptyState message="No tournament appearances available yet." />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {appearances.map((entry) => (
              <div
                key={entry.id}
                className="space-y-2 rounded-2xl border border-white/10 bg-white/4 p-3 sm:p-4"
              >
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
                  <Link
                    href={`/tournaments/${entry.category.tournament.slug}`}
                    className="font-medium text-foreground transition hover:text-primary"
                  >
                    {entry.category.tournament.name}
                  </Link>

                  <span>•</span>

                  <Link
                    href={`/tournaments/${entry.category.tournament.slug}/categories/${entry.category.code}`}
                    className="font-medium text-primary transition hover:opacity-80"
                  >
                    {entry.category.code}
                  </Link>

                  <span>•</span>

                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(entry.category.tournament.eventDate)}
                  </span>
                </div>

                <TeamCard
                  team={{
                    id: entry.id,
                    teamName: entry.teamName,
                    player1: {
                      fullName: entry.player1.fullName,
                      nickname: entry.player1.nickname,
                    },
                    player2: {
                      fullName: entry.player2.fullName,
                      nickname: entry.player2.nickname,
                    },
                  }}
                  badgeLabel={entry.category.code}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
