import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getLeaderboard } from "@/lib/rankings/queries";

export default async function LeaderboardPage() {
  const universalLeaderboard = await getLeaderboard({
    scope: "UNIVERSAL",
  });

  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <PublicPageHeader
        eyebrow="Leaderboard"
        title="Community players universal ranking"
        description="Track player standings across completed tournaments based on final placements and recorded results."
      />

      <Card className="rounded-[1.75rem] border-white/10 bg-white/4">
        <CardContent className="p-0">
          {universalLeaderboard.length === 0 ? (
            <div className="px-6 py-10 text-sm leading-7 text-muted-foreground sm:text-base">
              No ranking data is available yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 text-sm">
                <thead className="border-b border-white/10 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Rank</th>
                    <th className="px-4 py-3 font-medium">Player</th>
                    <th className="px-4 py-3 font-medium">Nickname</th>
                    <th className="px-4 py-3 font-medium">Points</th>
                    <th className="px-4 py-3 font-medium">Tournaments</th>
                  </tr>
                </thead>
                <tbody>
                  {universalLeaderboard.map((entry) => (
                    <tr
                      key={entry.playerId}
                      className="border-b border-white/6 last:border-b-0"
                    >
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {entry.rank}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/players/${entry.playerId}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {entry.fullName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        @{entry.nickname}
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {entry.totalPoints}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {entry.tournamentsCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
