import { CreateSheet } from "@/components/admin/create-sheet";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { CreateTournamentForm } from "@/components/admin/tournaments/create-tournament-form";
import { TournamentsTable } from "@/components/admin/tournaments/tournaments-table";
import { SectionCard } from "@/components/admin/section-card";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
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
    <PageContainer className="space-y-4">
      <AdminShellHeader
        activeItem="tournaments"
        title="Tournament management"
        description="Create tournament shells, define categories, and grow them into full operational events."
        actions={
          <CreateSheet
            triggerLabel="Add tournament"
            title="Create tournament"
            description="Create a single-day tournament shell with location, status, and summary."
          >
            <CreateTournamentForm />
          </CreateSheet>
        }
      />

      <CompactStatRow>
        <CompactStatPill label="Tournaments" value={tournamentCount} />
      </CompactStatRow>

      <SectionCard
        title="Tournament directory"
        description="Current tournaments and their operational progress."
      >
        <TournamentsTable tournaments={tournaments} />
      </SectionCard>
    </PageContainer>
  );
}
