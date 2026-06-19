import { notFound } from "next/navigation";
import { FolderPlus } from "lucide-react";

import { CreateDialog } from "@/components/admin/create-dialog";
import { CreateCategoryForm } from "@/components/admin/tournaments/create-category-form";
import { TournamentCategoriesList } from "@/components/admin/tournaments/tournament-categories-list";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { prisma } from "@/lib/db/prisma";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";

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
    <PageContainer className="space-y-4 sm:space-y-6">
      <AdminShellHeader title={tournament.name} />

      <section className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
      </section>

      <TournamentCategoriesList
        tournamentId={tournament.id}
        categories={tournament.categories}
      />
    </PageContainer>
  );
}
