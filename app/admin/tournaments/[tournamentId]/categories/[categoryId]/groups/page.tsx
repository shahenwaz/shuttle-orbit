import { notFound } from "next/navigation";
import { FolderPlus, Layers3, MoveRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { CreateDialog } from "@/components/admin/create-dialog";
import { CreateSheet } from "@/components/admin/create-sheet";
import { AssignTeamToGroupForm } from "@/components/admin/groups/assign-team-to-group-form";
import { CreateGroupForm } from "@/components/admin/groups/create-group-form";
import { CreateStageForm } from "@/components/admin/groups/create-stage-form";
import { GroupsOverview } from "@/components/admin/groups/groups-overview";
import { CategoryWorkspaceHeader } from "@/components/admin/layout/category-workspace-header";
import { EmptyState } from "@/components/shared/empty-state";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { PageContainer } from "@/components/layout/page-container";
import { TeamCard } from "@/components/tournaments/team-card";
import { prisma } from "@/lib/db/prisma";
import { formatTeamName } from "@/lib/utils/format";
import { StageCardActions } from "@/components/admin/groups/stage-card-actions";
import { ShuffleUnassignedTeamsButton } from "@/components/admin/groups/shuffle-unassigned-teams-button";

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
          orderBy: {
            stageOrder: "asc",
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

  const groupStages = category.stages.filter(
    (stage) =>
      !["quarter_final", "semi_final", "final", "third_place"].includes(
        stage.stageType,
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

  const groupOptions = groupStages.flatMap((stage) =>
    stage.groups.map((group) => ({
      id: group.id,
      name: group.name,
      stageName: stage.name,
    })),
  );

  const firstGroupStage = groupStages
    .filter((stage) => stage.groups.length > 0)
    .sort((a, b) => a.stageOrder - b.stageOrder)[0];

  const firstGroupStageAssignedTeamIds = new Set(
    firstGroupStage?.groups.flatMap((group) =>
      group.memberships.map((membership) => membership.teamEntry.id),
    ) ?? [],
  );

  const firstGroupStageUnassignedCount = firstGroupStage
    ? category.teamEntries.filter(
        (team) => !firstGroupStageAssignedTeamIds.has(team.id),
      ).length
    : 0;

  const canShuffleFirstGroupStage =
    Boolean(firstGroupStage) && firstGroupStageUnassignedCount > 0;

  return (
    <PageContainer className="space-y-6">
      <CategoryWorkspaceHeader
        tournamentId={tournament.id}
        categoryId={category.id}
        tournamentName={tournament.name}
        categoryName={`${category.name} groups`}
        description="Create multiple group stages, assign teams, and manage qualification pathways for this category."
        activeTab="groups"
        stats={
          <>
            <CompactStatPill label="Stages" value={groupStages.length} />
            <CompactStatPill
              label="Teams"
              value={category.teamEntries.length}
            />
            <CompactStatPill label="Groups" value={groupOptions.length} />
          </>
        }
        actions={
          <>
            <CreateDialog
              triggerLabel="Add stage"
              title="Create group stage"
              description="Create another group stage such as Quarter Final Groups."
              triggerClassName={actionPillButtonClassName({
                variant: "create",
                className:
                  "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
              })}
              triggerIcon={<Layers3 className="h-3.5 w-3.5" />}
            >
              <CreateStageForm
                tournamentId={tournament.id}
                categoryId={category.id}
              />
            </CreateDialog>

            <CreateDialog
              triggerLabel="Add group"
              title="Create group"
              description="Add a group inside one of the existing group stages."
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
                stages={groupStages.map((stage) => ({
                  id: stage.id,
                  name: stage.name,
                }))}
              />
            </CreateDialog>

            <CreateSheet
              triggerLabel="Assign team"
              title="Assign team to group"
              description="Assign or move a category team into any group across the group stages."
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

            <ShuffleUnassignedTeamsButton
              tournamentId={tournament.id}
              categoryId={category.id}
              disabled={!canShuffleFirstGroupStage}
              unassignedCount={firstGroupStageUnassignedCount}
            />
          </>
        }
      />

      {groupStages.length === 0 ? (
        <EmptyState message="No group stages created yet." />
      ) : (
        <div className="grid gap-6">
          {groupStages.map((stage) => {
            const assignedTeamIds = new Set(
              stage.groups.flatMap((group) =>
                group.memberships.map((membership) => membership.teamEntry.id),
              ),
            );

            const unassignedTeams = category.teamEntries.filter(
              (team) => !assignedTeamIds.has(team.id),
            );

            const shouldShowUnassignedTeams =
              stage.stageOrder ===
                Math.min(...groupStages.map((item) => item.stageOrder)) &&
              unassignedTeams.length > 0;

            return (
              <section key={stage.id} className="space-y-4">
                <div className="surface-card overflow-hidden">
                  <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
                    <div className="flex items-start justify-between gap-3">
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

                      <StageCardActions
                        tournamentId={tournament.id}
                        categoryId={category.id}
                        stageId={stage.id}
                        stageName={stage.name}
                      />
                    </div>
                  </div>
                </div>

                <section
                  className={cn(
                    "grid gap-4",
                    shouldShowUnassignedTeams
                      ? "xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]"
                      : "grid-cols-1",
                  )}
                >
                  <GroupsOverview
                    tournamentId={tournament.id}
                    categoryId={category.id}
                    groups={stage.groups}
                  />

                  {shouldShowUnassignedTeams ? (
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

                      <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
                        {unassignedTeams.length === 0 ? (
                          <EmptyState message="All category teams are assigned in this stage." />
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
                  ) : null}
                </section>
              </section>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
