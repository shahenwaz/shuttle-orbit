import { Trophy } from "lucide-react";

import { CreateTournamentForm } from "@/components/admin/tournaments/create-tournament-form";
import { TournamentsTable } from "@/components/admin/tournaments/tournaments-table";
import { SectionCard } from "@/components/admin/section-card";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";

export default async function AdminTournamentsPage() {
  const [tournaments, tournamentCount] = await Promise.all([
    prisma.tournament.findMany({
      orderBy: {
        startDate: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        startDate: true,
        endDate: true,
        status: true,
        _count: {
          select: {
            categories: true,
            teamEntries: true,
            matches: true,
          },
        },
      },
    }),
    prisma.tournament.count(),
  ]);

  return (
    <PageContainer className="space-y-8">
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
          <Trophy className="h-4 w-4" />
          Admin tournaments
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tournament management
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Create tournament shells first, then attach categories, teams,
              groups, and match structures.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-sm text-muted-foreground">Total tournaments</p>
            <p className="mt-1 text-3xl font-bold">{tournamentCount}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="Create tournament"
          description="Start with the event shell, then enrich it with categories and operations."
        >
          <CreateTournamentForm />
        </SectionCard>

        <SectionCard
          title="Tournament directory"
          description="Track the current events and their current operational depth."
        >
          <TournamentsTable tournaments={tournaments} />
        </SectionCard>
      </section>
    </PageContainer>
  );
}
