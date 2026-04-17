import Link from "next/link";
import { notFound } from "next/navigation";

import { CompactStatPill } from "@/components/admin/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/admin/stats/compact-stat-row";
import { ResultsGroupList } from "@/components/admin/results/results-group-list";
import { SectionCard } from "@/components/admin/section-card";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
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
      <section className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/tournaments/${tournament.id}`}>
              Back to tournament
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm">
            <Link
              href={`/admin/tournaments/${tournament.id}/categories/${category.id}/fixtures`}
            >
              Manage fixtures
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          <div className="inline-flex rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Category results
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {category.name} results
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Record results and update standings from completed matches.
            </p>
          </div>
        </div>

        <CompactStatRow>
          <CompactStatPill label="Groups" value={groups.length} />
          <CompactStatPill label="Matches" value={category._count.matches} />
          <CompactStatPill label="Completed" value={completedMatches} />
        </CompactStatRow>
      </section>

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
