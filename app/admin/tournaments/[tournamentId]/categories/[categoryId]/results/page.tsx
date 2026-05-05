import { notFound } from "next/navigation";
import { ClipboardCheck } from "lucide-react";

import { KnockoutStageList } from "@/components/admin/knockout/knockout-stage-list";
import { CategoryWorkspaceHeader } from "@/components/admin/layout/category-workspace-header";
import { ResultsGroupList } from "@/components/admin/results/results-group-list";
import { EmptyState } from "@/components/shared/empty-state";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";
import { formatTeamName } from "@/lib/utils/format";

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
        knockoutStartStage: true,
        teamEntries: {
          orderBy: {
            createdAt: "asc",
          },
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
        stages: {
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
                    sets: {
                      orderBy: {
                        setNumber: "asc",
                      },
                    },
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
            matches: {
              where: {
                groupId: null,
              },
              orderBy: {
                createdAt: "asc",
              },
              include: {
                sets: {
                  orderBy: {
                    setNumber: "asc",
                  },
                },
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
          orderBy: {
            stageOrder: "asc",
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

  type CategoryStage = (typeof category.stages)[number];
  type CategoryTeamEntry = (typeof category.teamEntries)[number];

  const groupStages = category.stages.filter(
    (stage: CategoryStage) =>
      !["quarter_final", "semi_final", "final", "third_place"].includes(
        stage.stageType,
      ),
  );

  const knockoutStages = category.stages.filter((stage: CategoryStage) =>
    ["quarter_final", "semi_final", "final", "third_place"].includes(
      stage.stageType,
    ),
  );

  type GroupStage = (typeof groupStages)[number];
  type MatchRow = CategoryStage["matches"][number];

  const totalGroups = groupStages.reduce(
    (sum: number, stage: GroupStage) => sum + stage.groups.length,
    0,
  );

  const completedMatches = category.stages.reduce(
    (sum: number, stage: CategoryStage) =>
      sum +
      stage.matches.filter((match: MatchRow) => match.status === "completed")
        .length,
    0,
  );

  const teamOptions = category.teamEntries.map((team: CategoryTeamEntry) => ({
    id: team.id,
    label: formatTeamName(
      team.player1.fullName,
      team.player2.fullName,
      team.teamName,
    ),
  }));

  return (
    <PageContainer className="space-y-6">
      <CategoryWorkspaceHeader
        tournamentId={tournament.id}
        categoryId={category.id}
        tournamentName={tournament.name}
        categoryName={`${category.name} results`}
        description="Record group and knockout match scores, update winners, and keep standings accurate."
        activeTab="results"
        stats={
          <>
            <CompactStatPill label="Groups" value={totalGroups} />
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

      {groupStages.length === 0 ? (
        <EmptyState message="No group stages available yet." />
      ) : (
        <div className="grid gap-6">
          {groupStages.map((stage: GroupStage) => (
            <section key={stage.id} className="space-y-4">
              <div className="surface-card overflow-hidden">
                <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                    <h3 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                      {stage.name}
                    </h3>

                    <span className="text-xs text-muted-foreground sm:text-sm">
                      ⁜
                    </span>

                    <span className="text-xs text-muted-foreground sm:text-sm">
                      {stage.groups.length} groups
                    </span>
                  </div>
                </div>
              </div>

              <ResultsGroupList
                tournamentId={tournament.id}
                categoryId={category.id}
                groups={stage.groups}
              />
            </section>
          ))}
        </div>
      )}

      <KnockoutStageList
        tournamentId={tournament.id}
        categoryId={category.id}
        teams={teamOptions}
        stages={knockoutStages}
        mode="results"
        knockoutStartStageType={
          (category.knockoutStartStage as
            | "quarter_final"
            | "semi_final"
            | "final"
            | null) ?? null
        }
      />
    </PageContainer>
  );
}
