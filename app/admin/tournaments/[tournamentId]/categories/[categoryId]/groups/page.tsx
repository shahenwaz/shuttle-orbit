import { notFound } from "next/navigation";
import { FolderPlus, MoveRight } from "lucide-react";

import { CreateDialog } from "@/components/admin/create-dialog";
import { CreateSheet } from "@/components/admin/create-sheet";
import { AssignTeamToGroupForm } from "@/components/admin/groups/assign-team-to-group-form";
import { CreateGroupForm } from "@/components/admin/groups/create-group-form";
import { GroupsOverview } from "@/components/admin/groups/groups-overview";
import { CategoryWorkspaceHeader } from "@/components/admin/layout/category-workspace-header";
import { EmptyState } from "@/components/shared/empty-state";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { PageContainer } from "@/components/layout/page-container";
import { TeamCard } from "@/components/tournaments/team-card";
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

  const unassignedTeams = category.teamEntries.filter(
    (team) => !assignedTeamIds.has(team.id),
  );

  const teamOptions = unassignedTeams.map((team) => ({
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
              triggerClassName={actionPillButtonClassName({
                variant: "create",
                className:
                  "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
              })}
              triggerIcon={<FolderPlus className="h-3.5 w-3.5" />}
            >
              <CreateGroupForm
                tournamentId={tournament.id}
                categoryId={category.id}
              />
            </CreateDialog>

            <CreateSheet
              triggerLabel="Assign team"
              title="Assign team to group"
              description="Assign an unplaced category team into one of the available groups."
              triggerClassName={actionPillButtonClassName({
                variant: "link",
                className:
                  "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
              })}
              triggerIcon={<MoveRight className="h-3.5 w-3.5" />}
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

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
        <GroupsOverview
          tournamentId={tournament.id}
          categoryId={category.id}
          groups={groups}
        />

        <div className="surface-card overflow-hidden xl:self-start">
          <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <h4 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                Unassigned teams
              </h4>

              <span className="text-xs text-muted-foreground sm:text-sm">
                ⁜
              </span>

              <span className="text-xs text-muted-foreground sm:text-sm">
                {unassignedTeams.length} teams
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {unassignedTeams.length === 0 ? (
              <EmptyState message="All teams are currently assigned to groups." />
            ) : (
              <div className="grid gap-2">
                {unassignedTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={{
                      id: team.id,
                      teamName: team.teamName,
                      player1: {
                        fullName: team.player1.fullName,
                        nickname: team.player1.nickname,
                      },
                      player2: {
                        fullName: team.player2.fullName,
                        nickname: team.player2.nickname,
                      },
                    }}
                    badgeLabel="team"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
