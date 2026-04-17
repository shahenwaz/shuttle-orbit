import { Users } from "lucide-react";

import { CreateDialog } from "@/components/admin/create-dialog";
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Users className="h-4 w-4" />
              Admin players
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Player management
              </h1>
              <p className="max-w-2xl text-muted-foreground">
                Create and manage the reusable player base for tournaments,
                teams, and long-term records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-sm text-muted-foreground">Total players</p>
              <p className="mt-1 text-3xl font-bold">{playerCount}</p>
            </div>

            <CreateDialog
              triggerLabel="Add player"
              title="Create player"
              description="Add a player once, then reuse them in tournament teams."
            >
              <CreatePlayerForm />
            </CreateDialog>
          </div>
        </div>
      </section>

      <SectionCard
        title="Player directory"
        description="Your reusable player base for tournaments, teams, and rankings."
      >
        <PlayersTable players={players} />
      </SectionCard>
    </PageContainer>
  );
}
