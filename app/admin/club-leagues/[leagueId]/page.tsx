import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ClubLeagueDetailSections } from "@/components/admin/club-leagues/club-league-detail-sections";
import {
  ClubLeagueSectionTabs,
  type ClubLeagueSectionTab,
} from "@/components/admin/club-leagues/club-league-section-tabs";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { prisma } from "@/lib/db/prisma";

type AdminClubLeagueDetailPageProps = {
  params: Promise<{
    leagueId: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
};

export default async function AdminClubLeagueDetailPage({
  params,
  searchParams,
}: AdminClubLeagueDetailPageProps) {
  const { leagueId } = await params;
  const { tab } = await searchParams;

  const activeTab: ClubLeagueSectionTab =
    tab === "sides" || tab === "fixtures" ? tab : "overview";

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
          entryAId: true,
          entryBId: true,
          winnerEntryId: true,
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
        description="Review sides, generated fixtures, and later record results for this internal club league."
        actions={
          <Link
            href="/admin/club-leagues"
            className={actionPillButtonClassName({ variant: "neutral" })}
          >
            <ArrowLeft className="size-4" />
            Back
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
        <CompactStatPill label="Fixtures" value={league._count.matches} />
        <CompactStatPill label="Completed" value={completedMatches} />
      </section>

      <ClubLeagueSectionTabs leagueId={league.id} activeTab={activeTab} />

      <ClubLeagueDetailSections
        leagueId={league.id}
        activeTab={activeTab}
        rulesNote={league.rulesNote}
        sides={league.sides}
        matches={league.matches}
      />
    </PageContainer>
  );
}
