import { notFound } from "next/navigation";

import { CategoryWorkspaceHeader } from "@/components/admin/layout/category-workspace-header";
import { ResultsGroupList } from "@/components/admin/results/results-group-list";
import { SectionCard } from "@/components/admin/section-card";
import { CompactStatPill } from "@/components/admin/stats/compact-stat-pill";
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
                          },
                        },
                        player2: {
                          select: {
                            fullName: true,
                          },
                        },
                      },
                    },
                    teamB: {
                      include: {
                        player1: {
                          select: {
                            fullName: true,
                          },
                        },
                        player2: {
                          select: {
                            fullName: true,
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

  const completedMatches = groups
    .flatMap((group) => group.matches)
    .filter((match) => match.status === "completed").length;

  return (
    <PageContainer className="space-y-6">
      <CategoryWorkspaceHeader
        tournamentId={tournament.id}
        categoryId={category.id}
        tournamentName={tournament.name}
        categoryName={`${category.name} results`}
        description="Record results and update standings from completed matches."
        activeTab="results"
        stats={
          <>
            <CompactStatPill label="Groups" value={groups.length} />
            <CompactStatPill label="Matches" value={category._count.matches} />
            <CompactStatPill label="Completed" value={completedMatches} />
          </>
        }
      />

      <SectionCard
        title="Group results"
        description="Record and edit match results for the default group stage."
      >
        <ResultsGroupList
          tournamentId={tournament.id}
          categoryId={category.id}
          groups={groups}
        />
      </SectionCard>
    </PageContainer>
  );
}
