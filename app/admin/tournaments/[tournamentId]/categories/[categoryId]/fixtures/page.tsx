import Link from "next/link";
import { notFound } from "next/navigation";

import { CreateSheet } from "@/components/admin/create-sheet";
import { SectionCard } from "@/components/admin/section-card";
import { FixturesGroupList } from "@/components/admin/fixtures/fixtures-group-list";
import { GenerateGroupFixturesForm } from "@/components/admin/fixtures/generate-group-fixtures-form";
import { CompactStatPill } from "@/components/admin/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/admin/stats/compact-stat-row";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

type AdminCategoryFixturesPageProps = {
  params: Promise<{
    tournamentId: string;
    categoryId: string;
  }>;
};

export default async function AdminCategoryFixturesPage({
  params,
}: AdminCategoryFixturesPageProps) {
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
                memberships: {
                  select: {
                    id: true,
                  },
                },
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

  const groupOptions = groups.map((group) => ({
    id: group.id,
    name: group.name,
    teamCount: group.memberships.length,
    matchCount: group.matches.length,
  }));

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
              href={`/admin/tournaments/${tournament.id}/categories/${category.id}/groups`}
            >
              Manage groups
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          <div className="inline-flex rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Category fixtures
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {category.name} fixtures
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Generate round robin fixtures for a group and prepare this
              category for score entry.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <CompactStatRow className="flex-1">
            <CompactStatPill label="Groups" value={groups.length} />
            <CompactStatPill
              label="Teams"
              value={category._count.teamEntries}
            />
            <CompactStatPill label="Matches" value={category._count.matches} />
          </CompactStatRow>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <CreateSheet
              triggerLabel="Generate fixtures"
              title="Generate group fixtures"
              description="Generate round robin fixtures for one selected group."
            >
              <GenerateGroupFixturesForm
                tournamentId={tournament.id}
                categoryId={category.id}
                groups={groupOptions}
              />
            </CreateSheet>
          </div>
        </div>
      </section>

      <SectionCard
        title="Group fixtures"
        description="Fixtures currently generated for the default group stage."
      >
        <FixturesGroupList groups={groups} />
      </SectionCard>
    </PageContainer>
  );
}
