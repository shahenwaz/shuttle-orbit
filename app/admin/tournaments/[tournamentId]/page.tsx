import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  FolderPlus,
  MapPin,
  Pencil,
  Trophy,
} from "lucide-react";

import { CreateDialog } from "@/components/admin/create-dialog";
import { CreateSheet } from "@/components/admin/create-sheet";
import { SectionCard } from "@/components/admin/section-card";
import { CreateCategoryForm } from "@/components/admin/tournaments/create-category-form";
import { EditTournamentForm } from "@/components/admin/tournaments/edit-tournament-form";
import { TournamentCategoriesList } from "@/components/admin/tournaments/tournament-categories-list";
import { PageContainer } from "@/components/layout/page-container";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils/format";

type AdminTournamentDetailPageProps = {
  params: Promise<{
    tournamentId: string;
  }>;
};

const baseActionPillClassName =
  "h-auto rounded-full border px-3 py-1.5 text-[11px] font-medium shadow-none transition";

const backActionPillClassName = `${baseActionPillClassName} border-white/10 bg-background/70 text-foreground hover:bg-white/8 hover:text-foreground`;

const editActionPillClassName = `${baseActionPillClassName} border-sky-500/20 bg-sky-500/10 text-sky-100 hover:bg-sky-500/15 hover:text-sky-50`;

const addActionPillClassName = `${baseActionPillClassName} border-emerald-500/20 bg-emerald-500/12 text-emerald-100 hover:bg-emerald-500/18 hover:text-emerald-50`;

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
    <PageContainer className="space-y-4 sm:space-y-5">
      <section className="space-y-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            <Trophy className="h-3.5 w-3.5" />
            Tournament admin
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
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
              <div className="flex min-w-0 items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{tournament.location}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <CompactStatRow className="justify-start">
            <CompactStatPill
              label="Categories"
              value={tournament._count.categories}
            />
            <CompactStatPill
              label="Teams"
              value={tournament._count.teamEntries}
            />
            <CompactStatPill
              label="Matches"
              value={tournament._count.matches}
            />
          </CompactStatRow>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className={backActionPillClassName}
            >
              <Link href="/admin/tournaments">
                <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                Back
              </Link>
            </Button>

            <CreateSheet
              triggerLabel="Edit tour"
              title="Edit tournament"
              description="Update tournament details and mark it completed when finished."
              triggerClassName={editActionPillClassName}
              triggerIcon={<Pencil className="h-3.5 w-3.5" />}
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
              triggerClassName={addActionPillClassName}
              triggerIcon={<FolderPlus className="h-3.5 w-3.5" />}
            >
              <CreateCategoryForm tournamentId={tournament.id} />
            </CreateDialog>
          </div>
        </div>
      </section>

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
