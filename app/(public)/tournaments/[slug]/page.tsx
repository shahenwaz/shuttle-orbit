import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Swords, Users } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTournamentBySlug } from "@/lib/tournament/queries";
import { formatDate } from "@/lib/utils/format";

type TournamentDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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
    <PageContainer className="space-y-8">
      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-primary">
            Tournament
          </p>
          <h2 className="text-4xl font-bold tracking-tight">
            {tournament.name}
          </h2>
          {tournament.description ? (
            <p className="max-w-3xl text-muted-foreground">
              {tournament.description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDate(tournament.startDate)}</span>
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
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {tournament.categories.map((category: TournamentCategoryItem) => (
          <Link
            key={category.id}
            href={`/tournaments/${tournament.slug}/categories/${category.code}`}
          >
            <Card className="h-full rounded-3xl border-white/10 bg-white/5 transition hover:border-primary/30 hover:bg-white/[0.07]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {category.code}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {category.rulesSummary ? <p>{category.rulesSummary}</p> : null}
                <p>{category._count.teamEntries} teams</p>
                <p>{category._count.matches} matches</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </PageContainer>
  );
}
