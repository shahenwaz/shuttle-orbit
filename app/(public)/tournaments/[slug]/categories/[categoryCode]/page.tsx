import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import {
  PublicCategoryDetailHeader,
  type PublicCategoryTab,
} from "@/components/public/public-category-detail-header";
import { CategoryTabsView } from "@/components/tournaments/category-tabs-view";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getCategoryByTournamentAndCode,
  getCategoryMetadataByTournamentAndCode,
  getCategoryOverviewByTournamentAndCode,
  getCategoryTeamsByTournamentAndCode,
} from "@/lib/tournament/queries";
import { getLeaderboard } from "@/lib/rankings/queries";

type CategoryDetailPageProps = {
  params: Promise<{
    slug: string;
    categoryCode: string;
  }>;
  searchParams?: Promise<{
    tab?: string;
  }>;
};

function getActiveTab(tab: string | undefined): PublicCategoryTab {
  if (tab === "players") return "players";
  if (tab === "teams") return "teams";
  if (tab === "matches") return "matches";
  if (tab === "standings") return "standings";

  return "info";
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug, categoryCode } = await params;
  const { tournament, category } = await getCategoryMetadataByTournamentAndCode(
    slug,
    categoryCode,
  );

  if (!tournament || !category) {
    return buildPageMetadata({
      title: "Tournament Category",
      description:
        "View category standings, teams, fixtures, and results for this badminton tournament.",
    });
  }

  return buildPageMetadata({
    title: `${category.name} - ${tournament.name}`,
    description:
      category.rulesSummary ||
      `View ${category.name} standings, teams, fixtures, matches, and results from ${tournament.name}.`,
  });
}

function getRankingScopeForCategory(categoryCode: string) {
  const normalizedCode = categoryCode.trim().toUpperCase();

  if (normalizedCode === "MIXED") {
    return {
      scope: "UNIVERSAL" as const,
      label: "Universal",
    };
  }

  return {
    scope: "CATEGORY" as const,
    categoryCode: normalizedCode,
    label: `${normalizedCode}`,
  };
}

async function getCategoryPageData(
  slug: string,
  categoryCode: string,
  activeTab: PublicCategoryTab,
) {
  if (activeTab === "info") {
    const { tournament, category } =
      await getCategoryOverviewByTournamentAndCode(slug, categoryCode);

    if (!tournament || !category) {
      notFound();
    }

    return {
      tournament,
      category,
      tabData: {
        activeTab,
        category,
      } as const,
    };
  }

  if (activeTab === "teams" || activeTab === "players") {
    const { tournament, category } = await getCategoryTeamsByTournamentAndCode(
      slug,
      categoryCode,
    );

    if (!tournament || !category) {
      notFound();
    }

    if (activeTab === "players") {
      return {
        tournament,
        category,
        tabData: {
          activeTab,
          category,
        } as const,
      };
    }

    const rankingScope = getRankingScopeForCategory(category.code);
    const categoryLeaderboard = await getLeaderboard({
      scope: rankingScope.scope,
      categoryCode:
        rankingScope.scope === "CATEGORY"
          ? rankingScope.categoryCode
          : undefined,
    });

    const playerRanks = categoryLeaderboard.reduce<Record<string, number>>(
      (rankMap, row) => {
        rankMap[row.playerId] = row.rank;
        return rankMap;
      },
      {},
    );

    return {
      tournament,
      category,
      tabData: {
        activeTab,
        category,
        playerRanks,
      } as const,
    };
  }

  const { tournament, category } = await getCategoryByTournamentAndCode(
    slug,
    categoryCode,
  );

  if (!tournament || !category) {
    notFound();
  }

  return {
    tournament,
    category,
    tabData: {
      activeTab,
      category,
    } as const,
  };
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: CategoryDetailPageProps) {
  const { slug, categoryCode } = await params;
  const resolvedSearchParams = await searchParams;
  const activeTab = getActiveTab(resolvedSearchParams?.tab);
  const { tournament, category, tabData } = await getCategoryPageData(
    slug,
    categoryCode,
    activeTab,
  );

  const baseHref = `/tournaments/${tournament.slug}/categories/${category.code}`;

  return (
    <>
      <PublicCategoryDetailHeader
        tournament={{
          name: tournament.name,
          slug: tournament.slug,
        }}
        category={{
          name: category.name,
          rulesSummary: category.rulesSummary,
        }}
        activeTab={activeTab}
        baseHref={baseHref}
      />

      <PageContainer className="py-4 sm:py-6">
        <CategoryTabsView data={tabData} />
      </PageContainer>
    </>
  );
}
