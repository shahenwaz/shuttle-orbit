import { PageContainer } from "@/components/layout/page-container";
import { PlayersDirectory } from "@/components/players/players-directory";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { getPlayersDirectory } from "@/lib/player/queries";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Players Directory",
  description:
    "Explore the player directory, view community badminton player profiles, appearances, tournament history, and ranking progress.",
});

export default async function PlayersPage() {
  const players = await getPlayersDirectory();

  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <PublicPageHeader
        eyebrow="Players"
        title="Community badminton players"
        description="Browse players who have taken part in community tournaments and follow their ongoing participation."
      />

      {players.length === 0 ? (
        <EmptyState message="No players are available right now." />
      ) : (
        <PlayersDirectory players={players} />
      )}
    </PageContainer>
  );
}
