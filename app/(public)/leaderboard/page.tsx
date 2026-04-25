import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { LeaderboardFilterTabs } from "@/components/rankings/leaderboard-filter-tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAvailableLeaderboardCategories,
  getLeaderboard,
} from "@/lib/rankings/queries";

type LeaderboardPageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const activeCategory = resolvedSearchParams.category?.trim().toUpperCase();

  const [categoryCodes, leaderboard] = await Promise.all([
    getAvailableLeaderboardCategories(),
    getLeaderboard(
      activeCategory
        ? {
            scope: "CATEGORY",
            categoryCode: activeCategory,
          }
        : {
            scope: "UNIVERSAL",
          },
    ),
  ]);

  const title = activeCategory
    ? `${activeCategory} player rankings`
    : "Community players universal ranking";

  const description = activeCategory
    ? `Track player standings for the ${activeCategory} division based on completed tournament results.`
    : "Track player standings across completed tournaments based on final placements and recorded results.";

  const activeValue = activeCategory
    ? activeCategory.toLowerCase()
    : "universal";

  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <PublicPageHeader
        eyebrow="Leaderboard"
        title={title}
        description={description}
      />

      <LeaderboardFilterTabs
        activeValue={activeValue}
        categoryCodes={categoryCodes}
      />

      <Card className="rounded-[1.75rem] border-white/10 bg-white/4">
        <CardContent className="p-0">
          {leaderboard.length === 0 ? (
            <div className="px-6 py-10 text-sm leading-7 text-muted-foreground sm:text-base">
              No ranking data is available yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-180 text-sm">
                <thead className="border-b border-white/10 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Rank</th>
                    <th className="px-4 py-3 font-medium">Player</th>
                    <th className="px-4 py-3 font-medium">Nickname</th>
                    <th className="px-4 py-3 font-medium">Best category</th>
                    <th className="px-4 py-3 font-medium">Points</th>
                    <th className="px-4 py-3 font-medium">Tournaments</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
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

                      <td className="px-4 py-3 text-muted-foreground">
                        {entry.bestCategory ?? "—"}
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
