import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/shared/empty-state";
import { PlayersDirectory } from "@/components/players/players-directory";
import { getPlayersDirectory } from "@/lib/player/queries";

export default async function PlayersPage() {
  const players = await getPlayersDirectory();

  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <section className="space-y-3 sm:space-y-4">
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
            Community players
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Players
          </h1>

          <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            Browse all registered players across tournaments and categories.
          </p>
        </div>
      </section>

      {players.length === 0 ? (
        <EmptyState message="No players available yet." />
      ) : (
        <PlayersDirectory players={players} />
      )}
    </PageContainer>
  );
}
