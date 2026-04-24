import { PlusSquare } from "lucide-react";

import { CreateSheet } from "@/components/admin/create-sheet";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { CreateTournamentForm } from "@/components/admin/tournaments/create-tournament-form";
import { TournamentsTable } from "@/components/admin/tournaments/tournaments-table";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";

export default async function AdminTournamentsPage() {
  const [tournaments, tournamentCount] = await Promise.all([
    prisma.tournament.findMany({
      orderBy: {
        eventDate: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        eventDate: true,
        description: true,
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
    <PageContainer className="space-y-4 sm:space-y-6">
      <AdminShellHeader
        activeItem="tournaments"
        title="Tournament management"
        description="Create tournament shells, define categories, and grow them into full operational events."
      />

      <section className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <CompactStatPill label="Tournaments" value={tournamentCount} />

        <CreateSheet
          triggerLabel="Add tournament"
          title="Create tournament"
          description="Create a single-day tournament shell with location and summary."
          triggerClassName={actionPillButtonClassName({
            variant: "create",
            className:
              "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
          })}
          triggerIcon={<PlusSquare className="h-3.5 w-3.5" />}
        >
          <CreateTournamentForm />
        </CreateSheet>
      </section>

      <TournamentsTable tournaments={tournaments} />
    </PageContainer>
  );
}
