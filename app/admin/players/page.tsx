import { CreateDialog } from "@/components/admin/create-dialog";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { CreatePlayerForm } from "@/components/admin/players/create-player-form";
import { EmptyState } from "@/components/shared/empty-state";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
import { PlayerCard } from "@/components/tournaments/player-card";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";

export default async function AdminPlayersPage() {
  const [players, playerCount] = await Promise.all([
    prisma.player.findMany({
      orderBy: {
        fullName: "asc",
      },
      select: {
        id: true,
        fullName: true,
        nickname: true,
      },
    }),
    prisma.player.count(),
  ]);

  return (
    <PageContainer className="space-y-4 sm:space-y-5">
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

      {players.length === 0 ? (
        <EmptyState message="No players added yet. Create the first player to start building your tournament pool." />
      ) : (
        <div className="grid gap-1.5 sm:gap-2 md:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
