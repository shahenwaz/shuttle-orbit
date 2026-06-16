import { PlusSquare } from "lucide-react";

import { CreateSheet } from "@/components/admin/create-sheet";
import { LeagueCard } from "@/components/admin/leagues/league-card";
import { LeagueEmptyState } from "@/components/admin/leagues/league-empty-state";
import { CreateLeagueForm } from "@/components/admin/leagues/create-league-form";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { prisma } from "@/lib/db/prisma";

export default async function AdminLeaguesPage() {
  const managedClub = await prisma.club.findFirst({
    where: {
      OR: [{ slug: "bdbc" }, { isManagedClub: true }],
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      players: {
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
      },
    },
  });

  const [leagues, leagueCount] = await Promise.all([
    prisma.league.findMany({
      where: managedClub ? { hostClubId: managedClub.id } : undefined,
      orderBy: { playedAt: "desc" },
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
    prisma.league.count({
      where: managedClub ? { hostClubId: managedClub.id } : undefined,
    }),
  ]);

  const memberPlayers =
    managedClub?.players.map((player) => ({
      id: player.id,
      fullName: player.fullName,
      nickname: player.nickname,
    })) ?? [];

  const clubDisplayName =
    managedClub?.shortName || managedClub?.name || "Managed club";

  return (
    <PageContainer className="space-y-4 sm:space-y-6">
      <AdminShellHeader
        title="Community leagues"
        description="Create and manage friendly community leagues separately from formal Shuttle Orbit tournaments and rankings."
      />

      <section className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <CompactStatPill label="Host club" value={clubDisplayName} />
        <CompactStatPill label="Players" value={memberPlayers.length} />
        <CompactStatPill label="Leagues" value={leagueCount} />

        {managedClub ? (
          <CreateSheet
            triggerLabel="New league"
            title="Create community league"
            description="Create a friendly league and generate fixtures from selected players."
            triggerClassName={actionPillButtonClassName({
              variant: "create",
              className:
                "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
            })}
            triggerIcon={<PlusSquare className="h-3.5 w-3.5" />}
          >
            <CreateLeagueForm
              clubId={managedClub.id}
              players={memberPlayers}
            />
          </CreateSheet>
        ) : null}
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
