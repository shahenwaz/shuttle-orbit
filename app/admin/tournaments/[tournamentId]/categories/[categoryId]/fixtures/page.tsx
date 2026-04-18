import { notFound } from "next/navigation";

import { CreateSheet } from "@/components/admin/create-sheet";
import { FixturesGroupList } from "@/components/admin/fixtures/fixtures-group-list";
import { GenerateGroupFixturesForm } from "@/components/admin/fixtures/generate-group-fixtures-form";
import { CategoryWorkspaceHeader } from "@/components/admin/layout/category-workspace-header";
import { SectionCard } from "@/components/admin/section-card";
import { CompactStatPill } from "@/components/admin/stats/compact-stat-pill";
import { PageContainer } from "@/components/layout/page-container";
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
      <CategoryWorkspaceHeader
        tournamentId={tournament.id}
        categoryId={category.id}
        tournamentName={tournament.name}
        categoryName={`${category.name} fixtures`}
        description="Generate round robin fixtures for a group and prepare this category for score entry."
        activeTab="fixtures"
        stats={
          <>
            <CompactStatPill label="Groups" value={groups.length} />
            <CompactStatPill
              label="Teams"
              value={category._count.teamEntries}
            />
            <CompactStatPill label="Matches" value={category._count.matches} />
          </>
        }
        actions={
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
        }
      />

      <SectionCard
        title="Group fixtures"
        description="Fixtures currently generated for the default group stage."
      >
        <FixturesGroupList
          tournamentId={tournament.id}
          categoryId={category.id}
          groups={groups}
        />
      </SectionCard>
    </PageContainer>
  );
}
