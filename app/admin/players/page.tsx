import { CreateDialog } from "@/components/admin/create-dialog";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { CreatePlayerForm } from "@/components/admin/players/create-player-form";
import { PlayersTable } from "@/components/admin/players/players-table";
import { SectionCard } from "@/components/admin/section-card";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";

export default async function AdminPlayersPage() {
  const [players, playerCount] = await Promise.all([
    prisma.player.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fullName: true,
        nickname: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.player.count(),
  ]);

  return (
    <PageContainer className="space-y-8">
      <AdminShellHeader
        activeItem="players"
        title="Player management"
        description="Create and maintain the reusable player base for tournaments, teams, and rankings."
        actions={
          <CreateDialog
            triggerLabel="Add player"
            title="Create player"
            description="Add a player once, then reuse them in tournament teams."
          >
            <CreatePlayerForm />
          </CreateDialog>
        }
      />

      <CompactStatRow>
        <CompactStatPill label="Players" value={playerCount} />
      </CompactStatRow>

      <SectionCard
        title="Player directory"
        description="Your reusable player base for tournaments, teams, and rankings."
      >
        <PlayersTable players={players} />
      </SectionCard>
    </PageContainer>
  );
}
