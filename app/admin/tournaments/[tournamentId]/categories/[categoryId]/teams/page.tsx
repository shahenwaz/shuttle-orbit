import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users2 } from "lucide-react";

import { CreateTeamEntryForm } from "@/components/admin/teams/create-team-entry-form";
import { TeamEntriesList } from "@/components/admin/teams/team-entries-list";
import { SectionCard } from "@/components/admin/section-card";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
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
        slug: true,
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
    <PageContainer className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/tournaments/${tournament.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to tournament
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Users2 className="h-4 w-4" />
              Category teams
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {category.name} team entries
            </h1>

            <p className="max-w-2xl text-muted-foreground">
              Manage doubles teams for this category inside {tournament.name}.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="surface-panel px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">Teams</p>
              <p className="mt-1 text-xl font-semibold">
                {category._count.teamEntries}
              </p>
            </div>
            <div className="surface-panel px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">Stages</p>
              <p className="mt-1 text-xl font-semibold">
                {category._count.stages}
              </p>
            </div>
            <div className="surface-panel px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">Matches</p>
              <p className="mt-1 text-xl font-semibold">
                {category._count.matches}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="Create team"
          description="Select two unique players. Each player can only belong to one team in the same category."
        >
          <CreateTeamEntryForm
            tournamentId={tournament.id}
            categoryId={category.id}
            players={players}
          />
        </SectionCard>

        <SectionCard
          title="Category teams"
          description="Existing team entries for this tournament category."
        >
          <TeamEntriesList teams={category.teamEntries} />
        </SectionCard>
      </section>
    </PageContainer>
  );
}
