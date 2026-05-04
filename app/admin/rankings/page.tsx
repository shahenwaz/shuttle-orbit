import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { PageContainer } from "@/components/layout/page-container";
import { AdminRankingTournamentCard } from "@/components/admin/rankings/admin-ranking-tournament-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getAdminRankingTournaments } from "@/lib/rankings/admin-queries";

export default async function AdminRankingsPage() {
  const tournaments = await getAdminRankingTournaments();

  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <AdminShellHeader
        title="Rankings"
        description="Review tournament ranking data and rebuild leaderboard records when completed results change."
      />

      {tournaments.length === 0 ? (
        <EmptyState message="No tournaments available for ranking review yet." />
      ) : (
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
          {tournaments.map((tournament) => (
            <AdminRankingTournamentCard
              key={tournament.id}
              tournament={tournament}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
