import { notFound } from "next/navigation";

import { CreateSheet } from "@/components/admin/create-sheet";
import { CategoryWorkspaceHeader } from "@/components/admin/layout/category-workspace-header";
import { CreateTeamEntryForm } from "@/components/admin/teams/create-team-entry-form";
import { TeamEntriesList } from "@/components/admin/teams/team-entries-list";
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
            stages: true,
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

  return (
    <PageContainer className="space-y-6">
      <CategoryWorkspaceHeader
        tournamentId={tournament.id}
        categoryId={category.id}
        tournamentName={tournament.name}
        categoryName={`${category.name} teams`}
        description={`Manage doubles teams for this category inside ${tournament.name}.`}
        activeTab="teams"
        actions={
          <CreateSheet
            triggerLabel="Add team"
            title="Create team"
            description="Select two unique players. Each player can only appear once in the same category."
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
