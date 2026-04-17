import { Users } from "lucide-react";

import { CreatePlayerForm } from "@/components/admin/players/create-player-form";
import { PlayersTable } from "@/components/admin/players/players-table";
import { SectionCard } from "@/components/admin/section-card";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";

export default async function AdminPlayersPage() {
  const [players, playerCount] = await Promise.all([
    prisma.player.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fullName: true,
        nickname: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.player.count(),
  ]);

  return (
    <PageContainer className="space-y-8">
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
          <Users className="h-4 w-4" />
          Admin players
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Player management
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Create and manage the player base that will be reused across
              tournaments, categories, teams, and long-term records.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-sm text-muted-foreground">Total players</p>
            <p className="mt-1 text-3xl font-bold">{playerCount}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="Create player"
          description="Add a player once, then reuse them in team entries across tournaments."
        >
          <CreatePlayerForm />
        </SectionCard>

        <SectionCard
          title="Player directory"
          description="A reusable player base for tournaments, teams, and ranking history."
        >
          <PlayersTable players={players} />
        </SectionCard>
      </section>
    </PageContainer>
  );
}
