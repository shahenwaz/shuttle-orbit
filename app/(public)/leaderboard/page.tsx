import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { LeaderboardFilterTabs } from "@/components/rankings/leaderboard-filter-tabs";
import { LeaderboardMobileList } from "@/components/rankings/leaderboard-mobile-list";
import { LeaderboardTable } from "@/components/rankings/leaderboard-table";
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
    ? `Track player standings for the ${activeCategory} category based on completed tournament results.`
    : "Track player standings across completed tournaments based on final placements and recorded results.";

  const activeValue = activeCategory
    ? activeCategory.toLowerCase()
    : "universal";

  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <PublicPageHeader
        eyebrow="Leaderboard"
        title={title}
        description={description}
      />

      <LeaderboardFilterTabs
        activeValue={activeValue}
        categoryCodes={categoryCodes}
      />

      {leaderboard.length === 0 ? (
        <Card className="rounded-[1.75rem] border-white/10 bg-white/4">
          <CardContent className="px-6 py-10 text-sm leading-7 text-muted-foreground/90 sm:text-base">
            No ranking data is available yet.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="md:hidden">
            <LeaderboardMobileList entries={leaderboard} />
          </div>

          <div className="hidden md:block">
            <LeaderboardTable entries={leaderboard} />
          </div>
        </>
      )}
    </PageContainer>
  );
}
