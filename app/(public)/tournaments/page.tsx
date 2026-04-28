import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { TournamentListCard } from "@/components/public/tournament-list-card";
import { Card, CardContent } from "@/components/ui/card";
import { getAllTournaments } from "@/lib/tournament/queries";

type TournamentListItem = Awaited<ReturnType<typeof getAllTournaments>>[number];

export default async function TournamentsPage() {
  const tournaments = await getAllTournaments();

  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <PublicPageHeader
        eyebrow="Tournaments"
        title="Upcoming and completed badminton tournaments"
        description="View tournament details, categories, fixtures, standings, and results from recent community events."
      />

      {tournaments.length === 0 ? (
        <Card className="rounded-md border-white/10 bg-white/4">
          <CardContent className="py-8 text-sm text-muted-foreground sm:text-base">
            No tournaments are available right now.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {tournaments.map((tournament: TournamentListItem) => (
            <TournamentListCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
