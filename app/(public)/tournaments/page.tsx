import Link from "next/link";
import { CalendarDays, MapPin, Swords, Users } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTournaments } from "@/lib/tournament/queries";
import { formatDate } from "@/lib/utils/format";

type TournamentListItem = Awaited<ReturnType<typeof getAllTournaments>>[number];
type TournamentCategoryListItem = TournamentListItem["categories"][number];

export default async function TournamentsPage() {
  const tournaments = await getAllTournaments();

  return (
    <PageContainer className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tournaments</h2>
        <p className="text-muted-foreground">
          Browse current and upcoming badminton tournaments.
        </p>
      </div>

      {tournaments.length === 0 ? (
        <Card className="rounded-3xl border-white/10 bg-white/5">
          <CardContent className="py-8 text-muted-foreground">
            No tournaments found yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tournaments.map((tournament: TournamentListItem) => (
            <Link key={tournament.id} href={`/tournaments/${tournament.slug}`}>
              <Card className="rounded-3xl border-white/10 bg-white/5 transition hover:border-primary/30 hover:bg-white/[0.07]">
                <CardHeader className="space-y-3">
                  <CardTitle className="text-2xl">{tournament.name}</CardTitle>
                  {tournament.description ? (
                    <p className="text-sm leading-6 text-muted-foreground">
                      {tournament.description}
                    </p>
                  ) : null}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>{formatDate(tournament.eventDate)}</span>
                    </div>

                    {tournament.location ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{tournament.location}</span>
                      </div>
                    ) : null}

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{tournament._count.teamEntries} teams</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Swords className="h-4 w-4" />
                      <span>{tournament._count.matches} matches</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tournament.categories.map(
                      (category: TournamentCategoryListItem) => (
                        <span
                          key={category.id}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground"
                        >
                          {category.code}
                        </span>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
