import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Trophy } from "lucide-react";

import { CreateDialog } from "@/components/admin/create-dialog";
import { CreateCategoryForm } from "@/components/admin/tournaments/create-category-form";
import { TournamentCategoriesList } from "@/components/admin/tournaments/tournament-categories-list";
import { SectionCard } from "@/components/admin/section-card";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils/format";
import { CreateSheet } from "@/components/admin/create-sheet";
import { EditTournamentForm } from "@/components/admin/tournaments/edit-tournament-form";

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
      <section className="space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <Trophy className="h-3.5 w-3.5" />
              Tournament admin
            </div>

            <div className="space-y-2">
              <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                {tournament.name}
              </h1>

              {tournament.description ? (
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  {tournament.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(tournament.eventDate)}</span>
              </div>

              {tournament.location ? (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{tournament.location}</span>
                </div>
              ) : null}

              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-foreground">
                {tournament.status}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/tournaments">Back to tournaments</Link>
            </Button>

            <Button asChild variant="outline" size="sm">
              <Link href={`/tournaments/${tournament.slug}`}>
                View public page
              </Link>
            </Button>

            <CreateSheet
              triggerLabel="Edit tournament"
              title="Edit tournament"
              description="Update tournament details and mark it completed when finished."
            >
              <EditTournamentForm
                tournament={{
                  id: tournament.id,
                  name: tournament.name,
                  location: tournament.location,
                  eventDate: tournament.eventDate,
                  status: tournament.status as "upcoming" | "completed",
                  description: tournament.description,
                }}
              />
            </CreateSheet>

            <CreateDialog
              triggerLabel="Add category"
              title="Create category"
              description="Add divisions like B, C, Mixed, or any custom format."
            >
              <CreateCategoryForm tournamentId={tournament.id} />
            </CreateDialog>
          </div>
        </div>
      </section>

      <CompactStatRow>
        <CompactStatPill
          label="Categories"
          value={tournament._count.categories}
        />
        <CompactStatPill label="Teams" value={tournament._count.teamEntries} />
        <CompactStatPill label="Matches" value={tournament._count.matches} />
      </CompactStatRow>

      <SectionCard
        title="Tournament categories"
        description="Categories define the competition divisions inside this event."
      >
        <TournamentCategoriesList
          tournamentId={tournament.id}
          categories={tournament.categories}
        />
      </SectionCard>
    </PageContainer>
  );
}
