import { PlusSquare } from "lucide-react";

import { CreateSheet } from "@/components/admin/create-sheet";
import { ClubLeagueCard } from "@/components/admin/club-leagues/club-league-card";
import { ClubLeagueEmptyState } from "@/components/admin/club-leagues/club-league-empty-state";
import { CreateClubLeagueForm } from "@/components/admin/club-leagues/create-club-league-form";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { prisma } from "@/lib/db/prisma";

export default async function AdminClubLeaguesPage() {
  const managedClub = await prisma.club.findFirst({
    where: {
      OR: [{ slug: "bdbc" }, { isManagedClub: true }],
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      members: {
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          nickname: true,
          player: {
            select: {
              id: true,
              fullName: true,
              nickname: true,
            },
          },
        },
      },
    },
  });

  const [leagues, leagueCount] = await Promise.all([
    prisma.clubLeague.findMany({
      where: managedClub ? { clubId: managedClub.id } : undefined,
      orderBy: { playedAt: "desc" },
      select: {
        id: true,
        title: true,
        playedAt: true,
        format: true,
        club: {
          select: {
            name: true,
            shortName: true,
          },
        },
        _count: {
          select: {
            entries: true,
            matches: true,
          },
        },
      },
    }),
    prisma.clubLeague.count({
      where: managedClub ? { clubId: managedClub.id } : undefined,
    }),
  ]);

  const memberPlayers =
    managedClub?.members.map((member) => ({
      id: member.id,
      fullName: member.player?.fullName ?? member.name,
      nickname: member.player?.nickname ?? member.nickname,
    })) ?? [];

  const clubDisplayName =
    managedClub?.shortName || managedClub?.name || "Managed club";

  return (
    <PageContainer className="space-y-4 sm:space-y-6">
      <AdminShellHeader
        title="Club leagues"
        description="Create and manage BDBC internal competitive leagues separately from formal Shuttle Orbit tournaments."
      />

      <section className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <CompactStatPill label="Club" value={clubDisplayName} />
        <CompactStatPill label="Members" value={memberPlayers.length} />
        <CompactStatPill label="Leagues" value={leagueCount} />

        {managedClub ? (
          <CreateSheet
            triggerLabel="New league"
            title="Create club league"
            description="Create an internal BDBC league and generate fixtures from selected club members."
            triggerClassName={actionPillButtonClassName({
              variant: "create",
              className:
                "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
            })}
            triggerIcon={<PlusSquare className="h-3.5 w-3.5" />}
          >
            <CreateClubLeagueForm
              clubId={managedClub.id}
              players={memberPlayers}
            />
          </CreateSheet>
        ) : null}
      </section>

      <div className="space-y-3">
        {leagues.length === 0 ? (
          <ClubLeagueEmptyState />
        ) : (
          leagues.map((league) => (
            <ClubLeagueCard key={league.id} league={league} />
          ))
        )}
      </div>
    </PageContainer>
  );
}
