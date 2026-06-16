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
      playerStats: {
        orderBy: [
          {
            matchesWon: "desc",
          },
          {
            pointsFor: "desc",
          },
          {
            pointsAgainst: "asc",
          },
        ],
        select: {
          id: true,
          matchesPlayed: true,
          matchesWon: true,
          matchesLost: true,
          pointsFor: true,
          pointsAgainst: true,
          player: {
            select: {
              fullName: true,
              nickname: true,
            },
          },
        },
      },
    },
  });

  if (!league) {
    notFound();
  }

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

      <ClubLeagueSectionTabs leagueId={league.id} activeTab={activeTab} />

      <ClubLeagueDetailSections
        leagueId={league.id}
        activeTab={activeTab}
        rulesNote={league.rulesNote}
        sides={league.sides}
        matches={league.matches}
        playerStats={league.playerStats}
      />
    </PageContainer>
  );
}
