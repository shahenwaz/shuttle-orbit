import { notFound } from "next/navigation";
import { Users2 } from "lucide-react";

import { CreateSheet } from "@/components/admin/create-sheet";
import { CategoryWorkspaceHeader } from "@/components/admin/layout/category-workspace-header";
import { CreateTeamEntryForm } from "@/components/admin/teams/create-team-entry-form";
import { TeamEntriesList } from "@/components/admin/teams/team-entries-list";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";

type AdminCategoryTeamsPageProps = {
  params: Promise<{
    tournamentId: string;
    categoryId: string;
  }>;
};

export default async function AdminCategoryTeamsPage({
  params,
}: AdminCategoryTeamsPageProps) {
  const { tournamentId, categoryId } = await params;

  const [tournament, category, players] = await Promise.all([
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
          select: {
            id: true,
            groups: {
              select: {
                id: true,
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
        _count: {
          select: {
            teamEntries: true,
            matches: true,
          },
        },
      },
    }),
    prisma.player.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        fullName: "asc",
      },
      select: {
        id: true,
        fullName: true,
        nickname: true,
      },
    }),
  ]);

  if (!tournament || !category) {
    notFound();
  }

  const totalGroups = category.stages.reduce(
    (sum, stage) => sum + stage.groups.length,
    0,
  );

  return (
    <PageContainer className="space-y-6">
      <CategoryWorkspaceHeader
        tournamentId={tournament.id}
        categoryId={category.id}
        tournamentName={tournament.name}
        categoryName={`${category.name} teams`}
        description={`Manage doubles teams for this category inside ${tournament.name}.`}
        activeTab="teams"
        stats={
          <>
            <CompactStatPill
              label="Teams"
              value={category._count.teamEntries}
            />
            <CompactStatPill label="Groups" value={totalGroups} />
            <CompactStatPill label="Matches" value={category._count.matches} />
          </>
        }
        actions={
          <CreateSheet
            triggerLabel="Add team"
            title="Create team"
            description="Select two unique players. Each player can only appear once in the same category."
            triggerClassName={actionPillButtonClassName({
              variant: "create",
              className:
                "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
            })}
            triggerIcon={<Users2 className="h-3.5 w-3.5" />}
          >
            <CreateTeamEntryForm
              tournamentId={tournament.id}
              categoryId={category.id}
              players={players}
            />
          </CreateSheet>
        }
      />

      <TeamEntriesList
        tournamentId={tournament.id}
        categoryId={category.id}
        teams={category.teamEntries}
      />
    </PageContainer>
  );
}
