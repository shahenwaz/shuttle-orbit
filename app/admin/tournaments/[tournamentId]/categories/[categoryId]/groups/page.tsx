import { notFound } from "next/navigation";

import { CreateDialog } from "@/components/admin/create-dialog";
import { CreateSheet } from "@/components/admin/create-sheet";
import { AssignTeamToGroupForm } from "@/components/admin/groups/assign-team-to-group-form";
import { CreateGroupForm } from "@/components/admin/groups/create-group-form";
import { GroupsOverview } from "@/components/admin/groups/groups-overview";
import { CategoryWorkspaceHeader } from "@/components/admin/layout/category-workspace-header";
import { SectionCard } from "@/components/admin/section-card";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";
import { formatTeamName } from "@/lib/utils/format";

type AdminCategoryGroupsPageProps = {
  params: Promise<{
    tournamentId: string;
    categoryId: string;
  }>;
};

export default async function AdminCategoryGroupsPage({
  params,
}: AdminCategoryGroupsPageProps) {
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
                  orderBy: {
                    createdAt: "asc",
                  },
                  include: {
                    teamEntry: {
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
      },
    }),
  ]);

  if (!tournament || !category) {
    notFound();
  }

  const groupStage = category.stages[0] ?? null;
  const groups = groupStage?.groups ?? [];

  const assignedTeamIds = new Set(
    groups.flatMap((group) =>
      group.memberships.map((membership) => membership.teamEntry.id),
    ),
  );

  const teamOptions = category.teamEntries.map((team) => ({
    id: team.id,
    label: formatTeamName(
      team.player1.fullName,
      team.player2.fullName,
      team.teamName,
    ),
  }));

  const groupOptions = groups.map((group) => ({
    id: group.id,
    name: group.name,
  }));

  const unassignedTeams = category.teamEntries.filter(
    (team) => !assignedTeamIds.has(team.id),
  );

  return (
    <PageContainer className="space-y-6">
      <CategoryWorkspaceHeader
        tournamentId={tournament.id}
        categoryId={category.id}
        tournamentName={tournament.name}
        categoryName={`${category.name} groups`}
        description="Create groups and assign teams to prepare this category for fixture generation."
        activeTab="groups"
        stats={
          <>
            <CompactStatPill label="Groups" value={groups.length} />
            <CompactStatPill
              label="Teams"
              value={category.teamEntries.length}
            />
            <CompactStatPill
              label="Unassigned"
              value={unassignedTeams.length}
            />
          </>
        }
        actions={
          <>
            <CreateDialog
              triggerLabel="Add group"
              title="Create group"
              description="Create groups like B1, B2, or C1 for this category."
            >
              <CreateGroupForm
                tournamentId={tournament.id}
                categoryId={category.id}
              />
            </CreateDialog>

            <CreateSheet
              triggerLabel="Assign team"
              title="Assign team to group"
              description="Assign or move a category team into one of the available groups."
            >
              <AssignTeamToGroupForm
                tournamentId={tournament.id}
                categoryId={category.id}
                teams={teamOptions}
                groups={groupOptions}
              />
            </CreateSheet>
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="Groups overview"
          description="Current groups and assigned teams for the default group stage."
        >
          <GroupsOverview
            tournamentId={tournament.id}
            categoryId={category.id}
            groups={groups}
          />
        </SectionCard>

        <SectionCard
          title="Unassigned teams"
          description="Teams not yet placed into any group in the current group stage."
        >
          {unassignedTeams.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              All teams are currently assigned to groups.
            </p>
          ) : (
            <div className="grid gap-3">
              {unassignedTeams.map((team) => (
                <div key={team.id} className="surface-panel p-4">
                  <p className="font-medium text-foreground">
                    {formatTeamName(
                      team.player1.fullName,
                      team.player2.fullName,
                      team.teamName,
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    @{team.player1.nickname} · @{team.player2.nickname}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </section>
    </PageContainer>
  );
}
