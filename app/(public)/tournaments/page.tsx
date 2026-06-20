import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { PublicTournamentCard } from "@/components/public/public-tournament-card";
import { surfaceCardClassName } from "@/components/shared/surface-card";
import { getAllTournaments } from "@/lib/tournament/queries";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Badminton Tournaments",
  description:
    "Browse upcoming and completed badminton tournaments, categories, fixtures, standings, and results from community events.",
});

type TournamentListItem = Awaited<ReturnType<typeof getAllTournaments>>[number];

export default async function TournamentsPage() {
  const tournaments = await getAllTournaments();

  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <PublicPageHeader
        eyebrow="Tournaments"
        title="Upcoming and previous badminton tournaments"
      />

      {tournaments.length === 0 ? (
        <div
          className={surfaceCardClassName({
            variant: "elevated",
            className: "px-4 py-8 text-sm text-muted-foreground sm:text-base",
          })}
        >
          No tournaments are available right now.
        </div>
      ) : (
        <div className="grid gap-2 sm:gap-2.5 sm:grid-cols-2">
          {tournaments.map((tournament: TournamentListItem) => (
            <PublicTournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
