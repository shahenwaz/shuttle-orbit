import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { PlayerAppearanceCard } from "@/components/players/player-appearance-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  getPlayerProfile,
  getPlayerProfileMetadata,
} from "@/lib/player/queries";
import { getPlayerInitials } from "@/lib/player/initials";
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
  const player = await getPlayerProfileMetadata(playerId);

  if (!player) {
    return buildPageMetadata({
      title: "Player Profile",
      description:
        "View a badminton player profile and tournament participation history.",
    });
  }

  return buildPageMetadata({
    title: player.fullName,
    description: `View ${player.fullName}'s badminton player profile and tournament participation history.`,
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

  const { player, appearances } = profile;

  type PlayerAppearance = (typeof appearances)[number];

  const uniqueTournaments = new Set(
    appearances.map((entry: PlayerAppearance) => entry.tournament.id),
  ).size;
  const initials = getPlayerInitials(player.fullName, player.nickname);

  return (
    <PageContainer className="space-y-4 sm:space-y-5">
      <section className="space-y-2.5 sm:space-y-3">
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

        <div className="min-w-0 border-b border-white/10 pb-2.5">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 text-sm font-semibold tracking-wide text-sky-300">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="wrap-break-word text-xl leading-tight font-bold tracking-tight text-sky-400 sm:text-2xl">
                {player.fullName}
              </h1>

              {player.nickname || player.publicClub ? (
                <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground sm:text-sm">
                  {player.nickname ? <span>@{player.nickname}</span> : null}
                  {player.nickname && player.publicClub ? <span>·</span> : null}
                  {player.publicClub ? (
                    <Link
                      href={`/clubs/${player.publicClub.slug}`}
                      className="min-w-0 truncate font-medium text-sky-300 transition hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
                    >
                      {player.publicClub.shortName ?? player.publicClub.name}
                    </Link>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted-foreground sm:text-xs">
                <span>
                  {appearances.length} appearance
                  {appearances.length === 1 ? "" : "s"}
                </span>
                <span>·</span>
                <span>
                  {uniqueTournaments} tournament
                  {uniqueTournaments === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-2.5 sm:space-y-3">
        <SectionIntro
          title="Tournament history"
          description="Categories, partners, and recorded results from this player's tournament appearances."
        />

        {appearances.length === 0 ? (
          <EmptyState message="No tournament appearances available yet." />
        ) : (
          <div className="space-y-1.5 sm:space-y-2">
            {appearances.map((entry: PlayerAppearance) => (
              <PlayerAppearanceCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
