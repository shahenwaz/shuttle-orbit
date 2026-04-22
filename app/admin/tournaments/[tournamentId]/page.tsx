import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  FolderPlus,
  MapPin,
  Pencil,
  Trophy,
  Trash2,
} from "lucide-react";

import { CreateDialog } from "@/components/admin/create-dialog";
import { CreateSheet } from "@/components/admin/create-sheet";
import { CreateCategoryForm } from "@/components/admin/tournaments/create-category-form";
import { EditTournamentForm } from "@/components/admin/tournaments/edit-tournament-form";
import { TournamentCategoriesList } from "@/components/admin/tournaments/tournament-categories-list";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils/format";
import { deleteTournamentAction } from "@/app/admin/tournaments/actions";

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
          stages: {
            select: {
              id: true,
              groups: {
                select: {
                  id: true,
                },
              },
            },
          },
          _count: {
            select: {
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
              className={actionPillButtonClassName({ variant: "neutral" })}
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
              triggerClassName={actionPillButtonClassName({ variant: "edit" })}
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
              triggerClassName={actionPillButtonClassName({
                variant: "create",
              })}
              triggerIcon={<FolderPlus className="h-3.5 w-3.5" />}
            >
              <CreateCategoryForm tournamentId={tournament.id} />
            </CreateDialog>

            <CreateDialog
              triggerLabel="Delete tournament"
              title="Delete tournament"
              description="This only works if the tournament has no categories."
              triggerClassName={actionPillButtonClassName({
                variant: "neutral",
                className:
                  "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
              })}
              triggerIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              <form
                className="space-y-4"
                action={async (formData) => {
                  "use server";
                  await deleteTournamentAction(formData);
                }}
              >
                <input
                  type="hidden"
                  name="tournamentId"
                  value={tournament.id}
                />

                <p className="text-sm text-muted-foreground">
                  Delete this tournament only after removing all categories.
                </p>

                <div className="flex justify-end">
                  <Button type="submit" variant="destructive">
                    Delete tournament
                  </Button>
                </div>
              </form>
            </CreateDialog>
          </div>
        </div>
      </section>

      <TournamentCategoriesList
        tournamentId={tournament.id}
        categories={tournament.categories}
      />
    </PageContainer>
  );
}
