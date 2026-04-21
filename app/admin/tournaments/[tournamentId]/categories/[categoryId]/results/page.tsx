import { notFound } from "next/navigation";
import { ClipboardCheck } from "lucide-react";

import { CategoryWorkspaceHeader } from "@/components/admin/layout/category-workspace-header";
import { ResultsGroupList } from "@/components/admin/results/results-group-list";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";

type AdminCategoryResultsPageProps = {
  params: Promise<{
    tournamentId: string;
    categoryId: string;
  }>;
};

export default async function AdminCategoryResultsPage({
  params,
}: AdminCategoryResultsPageProps) {
  const { tournamentId, categoryId } = await params;

  const [tournament, category] = await Promise.all([
    prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.tournamentCategory.findFirst({
      where: {
        id: categoryId,
        tournamentId,
      },
      include: {
        stages: {
          where: {
            stageOrder: 1,
          },
          include: {
            groups: {
              orderBy: {
                groupOrder: "asc",
              },
              include: {
                matches: {
                  orderBy: {
                    createdAt: "asc",
                  },
                  include: {
                    teamA: {
                      include: {
                        player1: {
                          select: {
                            fullName: true,
                            nickname: true,
                          },
                        },
                        player2: {
                          select: {
                            fullName: true,
                            nickname: true,
                          },
                        },
                      },
                    },
                    teamB: {
                      include: {
                        player1: {
                          select: {
                            fullName: true,
                            nickname: true,
                          },
                        },
                        player2: {
                          select: {
                            fullName: true,
                            nickname: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            teamEntries: true,
            matches: true,
          },
        },
      },
    }),
  ]);

  if (!tournament || !category) {
    notFound();
  }

  const groupStage = category.stages[0] ?? null;
  const groups = groupStage?.groups ?? [];
  const completedMatches = groups.reduce(
    (sum, group) =>
      sum +
      group.matches.filter((match) => match.status === "completed").length,
    0,
  );

  return (
    <PageContainer className="space-y-6">
      <CategoryWorkspaceHeader
        tournamentId={tournament.id}
        categoryId={category.id}
        tournamentName={tournament.name}
        categoryName={`${category.name} results`}
        description="Record match scores, update winners, and keep standings accurate for this category."
        activeTab="results"
        stats={
          <>
            <CompactStatPill label="Groups" value={groups.length} />
            <CompactStatPill label="Matches" value={category._count.matches} />
            <CompactStatPill label="Done" value={completedMatches} />
          </>
        }
        actions={
          <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-100 sm:px-3 sm:py-1.5 sm:text-[11px]">
            <ClipboardCheck className="h-3.5 w-3.5" />
            Record scores carefully
          </div>
        }
      />

      <ResultsGroupList
        tournamentId={tournament.id}
        categoryId={category.id}
        groups={groups}
      />
    </PageContainer>
  );
}
