import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Trophy } from "lucide-react";

import { CreateCategoryForm } from "@/components/admin/tournaments/create-category-form";
import { TournamentCategoriesList } from "@/components/admin/tournaments/tournament-categories-list";
import { SectionCard } from "@/components/admin/section-card";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils/format";

type AdminTournamentDetailPageProps = {
  params: Promise<{
    tournamentId: string;
  }>;
};

export default async function AdminTournamentDetailPage({
  params,
}: AdminTournamentDetailPageProps) {
  const { tournamentId } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      categories: {
        orderBy: {
          code: "asc",
        },
        include: {
          _count: {
            select: {
              stages: true,
              teamEntries: true,
              matches: true,
            },
          },
        },
      },
      _count: {
        select: {
          categories: true,
          teamEntries: true,
          matches: true,
        },
      },
    },
  });

  if (!tournament) {
    notFound();
  }

  return (
    <PageContainer className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Trophy className="h-4 w-4" />
              Tournament admin
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {tournament.name}
              </h1>

              {tournament.description ? (
                <p className="max-w-3xl text-muted-foreground">
                  {tournament.description}
                </p>
              ) : null}
            </div>

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

              <div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground">
                  {tournament.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/admin/tournaments">Back to tournaments</Link>
            </Button>
            <Button asChild>
              <Link href={`/tournaments/${tournament.slug}`}>
                View public page
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="surface-card p-4">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="mt-1 text-2xl font-bold">
            {tournament._count.categories}
          </p>
        </div>

        <div className="surface-card p-4">
          <p className="text-sm text-muted-foreground">Teams</p>
          <p className="mt-1 text-2xl font-bold">
            {tournament._count.teamEntries}
          </p>
        </div>

        <div className="surface-card p-4">
          <p className="text-sm text-muted-foreground">Matches</p>
          <p className="mt-1 text-2xl font-bold">{tournament._count.matches}</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="Create category"
          description="Add divisions like B, C, Mixed, or any custom format you need."
        >
          <CreateCategoryForm tournamentId={tournament.id} />
        </SectionCard>

        <SectionCard
          title="Tournament categories"
          description="Categories define the competition divisions inside this event."
        >
          <TournamentCategoriesList
            tournamentId={tournament.id}
            categories={tournament.categories}
          />
        </SectionCard>
      </section>
    </PageContainer>
  );
}
