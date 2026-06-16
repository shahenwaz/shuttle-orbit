import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { LeagueDetailSections } from "@/components/admin/leagues/league-detail-sections";
import {
  LeagueSectionTabs,
  type LeagueSectionTab,
} from "@/components/admin/leagues/league-section-tabs";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { DeleteLeagueButton } from "@/components/admin/leagues/delete-league-button";
import { prisma } from "@/lib/db/prisma";

type AdminLeagueDetailPageProps = {
  params: Promise<{
    leagueId: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
};

function getTeamPlayers(team: {
  players: {
    player: {
      fullName: string;
      nickname: string | null;
    };
  }[];
}) {
  const [player1, player2] = team.players.map((item) => item.player);

  return {
    player1: player1 ?? {
      fullName: "Unknown player",
      nickname: null,
    },
    player2: player2 ?? {
      fullName: "Unknown player",
      nickname: null,
    },
  };
}

export default async function AdminLeagueDetailPage({
  params,
  searchParams,
}: AdminLeagueDetailPageProps) {
  const { leagueId } = await params;
  const { tab } = await searchParams;

  const activeTab: LeagueSectionTab =
    tab === "sides" || tab === "fixtures" ? tab : "overview";

  const league = await prisma.league.findUnique({
    where: {
      id: leagueId,
    },
    select: {
      id: true,
      title: true,
      playedAt: true,
      format: true,
      rulesNote: true,
      hostClub: {
        select: {
          name: true,
          shortName: true,
        },
      },
      teams: {
        orderBy: {
          teamOrder: "asc",
        },
        select: {
          id: true,
          name: true,
          shortName: true,
          teamOrder: true,
          originLabel: true,
          players: {
            orderBy: {
              player: {
                fullName: "asc",
              },
            },
            select: {
              player: {
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
          teamAId: true,
          teamBId: true,
          winnerTeamId: true,
          teamA: {
            select: {
              name: true,
              shortName: true,
              players: {
                orderBy: {
                  player: {
                    fullName: "asc",
                  },
                },
                select: {
                  player: {
                    select: {
                      fullName: true,
                      nickname: true,
                    },
                  },
                },
              },
            },
          },
          teamB: {
            select: {
              name: true,
              shortName: true,
              players: {
                orderBy: {
                  player: {
                    fullName: "asc",
                  },
                },
                select: {
                  player: {
                    select: {
                      fullName: true,
                      nickname: true,
                    },
                  },
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
              teamAScore: true,
              teamBScore: true,
            },
          },
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

  type LeagueTeamRow = (typeof league.teams)[number];
  type LeagueMatchRow = (typeof league.matches)[number];

  const sideLabels = Array.from(
    new Set(
      league.teams.map((team: LeagueTeamRow) => team.originLabel ?? "Teams"),
    ),
  );

  const sides = sideLabels.map((sideLabel, sideIndex) => ({
    id: `${league.id}-${sideLabel}`,
    name: sideLabel,
    sideOrder: sideIndex + 1,
    entries: league.teams
      .filter(
        (team: LeagueTeamRow) => (team.originLabel ?? "Teams") === sideLabel,
      )
      .map((team: LeagueTeamRow) => {
        const { player1, player2 } = getTeamPlayers(team);

        return {
          id: team.id,
          displayName: team.shortName ?? team.name,
          entryOrder: team.teamOrder,
          player1,
          player2,
        };
      }),
  }));

  const matches = league.matches.map((match: LeagueMatchRow) => {
    const teamAPlayers = match.teamA ? getTeamPlayers(match.teamA) : null;
    const teamBPlayers = match.teamB ? getTeamPlayers(match.teamB) : null;

    return {
      id: match.id,
      matchOrder: match.matchOrder,
      roundLabel: match.roundLabel,
      scoreSummary: match.scoreSummary,
      entryAId: match.teamAId,
      entryBId: match.teamBId,
      winnerEntryId: match.winnerTeamId,
      entryA: match.teamA
        ? {
            displayName: match.teamA.shortName ?? match.teamA.name,
            player1: teamAPlayers?.player1 ?? {
              fullName: "Unknown player",
              nickname: null,
            },
            player2: teamAPlayers?.player2 ?? {
              fullName: "Unknown player",
              nickname: null,
            },
          }
        : null,
      entryB: match.teamB
        ? {
            displayName: match.teamB.shortName ?? match.teamB.name,
            player1: teamBPlayers?.player1 ?? {
              fullName: "Unknown player",
              nickname: null,
            },
            player2: teamBPlayers?.player2 ?? {
              fullName: "Unknown player",
              nickname: null,
            },
          }
        : null,
      sets: match.sets.map((set) => ({
        id: set.id,
        setNumber: set.setNumber,
        entryAScore: set.teamAScore,
        entryBScore: set.teamBScore,
      })),
    };
  });

  return (
    <PageContainer className="space-y-4 sm:space-y-6">
      <AdminShellHeader
        title={league.title}
        description="Review sides, generated fixtures, and record results for this community league."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/leagues"
              className={actionPillButtonClassName({ variant: "neutral" })}
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
            <DeleteLeagueButton leagueId={league.id} />
          </div>
        }
      />

      <LeagueSectionTabs leagueId={league.id} activeTab={activeTab} />

      <LeagueDetailSections
        leagueId={league.id}
        activeTab={activeTab}
        rulesNote={league.rulesNote}
        sides={sides}
        matches={matches}
        playerStats={league.playerStats}
      />
    </PageContainer>
  );
}
