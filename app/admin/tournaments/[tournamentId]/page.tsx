import { notFound } from "next/navigation";
import { FolderPlus, MapPin } from "lucide-react";

import { CreateDialog } from "@/components/admin/create-dialog";
import { CreateCategoryForm } from "@/components/admin/tournaments/create-category-form";
import { TournamentCategoriesList } from "@/components/admin/tournaments/tournament-categories-list";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { HeaderSurface } from "@/components/shared/header-surface";
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
    <>
      <HeaderSurface
        title={tournament.name}
        variant="tournament"
        meta={
          <>
            <span className="shrink-0 font-semibold text-primary">
              Tournament
            </span>
            <span className="shrink-0 text-white/25">•</span>
            <span className="shrink-0 text-muted-foreground">
              {formatDate(tournament.eventDate)}
            </span>

            {tournament.location ? (
              <>
                <span className="hidden shrink-0 text-white/25 sm:inline">
                  •
                </span>
                <span className="hidden min-w-0 items-center gap-1.5 truncate text-muted-foreground sm:inline-flex">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {tournament.location}
                </span>
              </>
            ) : null}
          </>
        }
        actions={
          <CreateDialog
            triggerLabel="Add category"
            title="Create category"
            description="Add divisions like B, C, Mixed, or any custom format."
            triggerClassName={actionPillButtonClassName({
              variant: "create",
              className:
                "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
            })}
            triggerIcon={<FolderPlus className="h-3.5 w-3.5" />}
          >
            <CreateCategoryForm tournamentId={tournament.id} />
          </CreateDialog>
        }
      />

      <PageContainer className="pt-4 pb-4 sm:pt-5 sm:pb-5">
        <TournamentCategoriesList
          tournamentId={tournament.id}
          categories={tournament.categories}
        />
      </PageContainer>
    </>
  );
}
