import { PlusSquare } from "lucide-react";

import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { CreateSheet } from "@/components/admin/create-sheet";
import { CreateLeagueForm } from "@/components/admin/leagues/create-league-form";
import { LeagueCard } from "@/components/admin/leagues/league-card";
import { LeagueEmptyState } from "@/components/admin/leagues/league-empty-state";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { prisma } from "@/lib/db/prisma";

export default async function AdminLeaguesPage() {
  const [clubs, leaguePlayers, leagues] = await Promise.all([
    prisma.club.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        shortName: true,
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
    prisma.league.findMany({
      orderBy: {
        playedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        playedAt: true,
        format: true,
        hostClub: {
          select: {
            name: true,
            shortName: true,
          },
        },
        _count: {
          select: {
            teams: true,
            matches: true,
          },
        },
      },
    }),
  ]);

  return (
    <PageContainer className="space-y-4 sm:space-y-5">
      <AdminShellHeader title="Community leagues" />

      <section className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
        <CompactStatPill label="Leagues" value={leagues.length} />

        {clubs.length > 0 ? (
          <CreateSheet
            triggerLabel="New league"
            title="Create community league"
            description="Choose a host club, select players, and generate fixtures."
            triggerClassName={actionPillButtonClassName({
              variant: "create",
              className:
                "shrink-0 px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
            })}
            triggerIcon={<PlusSquare className="h-3.5 w-3.5" />}
          >
            <CreateLeagueForm clubs={clubs} players={leaguePlayers} />
          </CreateSheet>
        ) : (
          <p className="mt-3 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Create a club before creating community leagues.
          </p>
        )}
      </section>

      <div className="space-y-3">
        {leagues.length === 0 ? (
          <LeagueEmptyState />
        ) : (
          leagues.map((league) => (
            <LeagueCard key={league.id} league={league} />
          ))
        )}
      </div>
    </PageContainer>
  );
}
