import Link from "next/link";
import { PlusSquare } from "lucide-react";

import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { ClubLeagueCard } from "@/components/admin/club-leagues/club-league-card";
import { ClubLeagueEmptyState } from "@/components/admin/club-leagues/club-league-empty-state";
import { ClubLeagueStatStrip } from "@/components/admin/club-leagues/club-league-stat-strip";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { prisma } from "@/lib/db/prisma";

export default async function AdminClubLeaguesPage() {
  const [leagues, leagueCount] = await Promise.all([
    prisma.clubLeague.findMany({
      orderBy: {
        playedAt: "desc",
      },
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
    prisma.clubLeague.count(),
  ]);

  return (
    <PageContainer>
      <AdminShellHeader
        title="Club Leagues"
        description="Create and manage internal competitive club leagues separately from formal Shuttle Orbit tournaments."
        actions={
          <Link
            href="/admin/club-leagues/new"
            className={actionPillButtonClassName({ variant: "create" })}
          >
            <PlusSquare className="size-4" />
            New club league
          </Link>
        }
      />

      <ClubLeagueStatStrip
        leagueCount={leagueCount}
        latestFormat={leagues[0]?.format.replaceAll("_", " ")}
        latestMatches={leagues[0]?._count.matches}
      />

      <div className="mt-6 grid gap-3">
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
