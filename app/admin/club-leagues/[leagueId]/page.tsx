import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ClubLeagueFixtureList } from "@/components/admin/club-leagues/club-league-fixture-list";
import { ClubLeagueSidePanel } from "@/components/admin/club-leagues/club-league-side-panel";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { prisma } from "@/lib/db/prisma";

type AdminClubLeagueDetailPageProps = {
  params: Promise<{
    leagueId: string;
  }>;
};

export default async function AdminClubLeagueDetailPage({
  params,
}: AdminClubLeagueDetailPageProps) {
  const { leagueId } = await params;

  const league = await prisma.clubLeague.findUnique({
    where: {
      id: leagueId,
    },
    select: {
      id: true,
      title: true,
      playedAt: true,
      format: true,
      rulesNote: true,
      club: {
        select: {
          name: true,
          shortName: true,
        },
      },
      sides: {
        orderBy: {
          sideOrder: "asc",
        },
        select: {
          id: true,
          name: true,
          sideOrder: true,
          entries: {
            orderBy: {
              entryOrder: "asc",
            },
            select: {
              id: true,
              displayName: true,
              entryOrder: true,
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
      matches: {
        orderBy: {
          matchOrder: "asc",
        },
        select: {
          id: true,
          matchOrder: true,
          roundLabel: true,
          scoreSummary: true,
          entryA: {
            select: {
              displayName: true,
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
          entryB: {
            select: {
              displayName: true,
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
          winnerEntryId: true,
          entryAId: true,
          entryBId: true,
          sets: {
            orderBy: {
              setNumber: "asc",
            },
            select: {
              id: true,
              setNumber: true,
              entryAScore: true,
              entryBScore: true,
            },
          },
        },
      },
      _count: {
        select: {
          entries: true,
          matches: true,
        },
      },
    },
  });

  if (!league) {
    notFound();
  }

  const completedMatches = league.matches.filter(
    (match) => match.winnerEntryId,
  ).length;

  return (
    <PageContainer className="space-y-4 sm:space-y-6">
      <AdminShellHeader
        title={league.title}
        description="Review generated club league sides, entries, and fixtures before entering scores."
        actions={
          <Link
            href="/admin/club-leagues"
            className={actionPillButtonClassName({ variant: "neutral" })}
          >
            <ArrowLeft className="size-4" />
            Back to leagues
          </Link>
        }
      />

      <section className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <CompactStatPill
          label="Club"
          value={league.club.shortName || league.club.name}
        />
        <CompactStatPill
          label="Date"
          value={league.playedAt.toLocaleDateString("en-IE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        />
        <CompactStatPill
          label="Format"
          value={league.format.replaceAll("_", " ")}
        />
        <CompactStatPill label="Entries" value={league._count.entries} />
        <CompactStatPill label="Fixtures" value={league._count.matches} />
        <CompactStatPill label="Completed" value={completedMatches} />
      </section>

      {league.rulesNote ? (
        <p className="rounded-md border border-white/10 bg-white/4 px-4 py-3 text-sm leading-6 text-muted-foreground">
          {league.rulesNote}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <ClubLeagueSidePanel sides={league.sides} />
        <ClubLeagueFixtureList matches={league.matches} />
      </div>
    </PageContainer>
  );
}
