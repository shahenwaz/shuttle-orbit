import { notFound } from "next/navigation";

import { LeagueDetailSections } from "@/components/admin/leagues/league-detail-sections";
import {
  LeagueSectionTabs,
  type LeagueSectionTab,
} from "@/components/admin/leagues/league-section-tabs";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";
import { HeaderSurface } from "@/components/shared/header-surface";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { formatLeagueFormat } from "@/lib/leagues/format";

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

function formatLeagueDate(date: Date) {
  return date.toLocaleDateString("en-IE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminLeagueDetailPage({
  params,
  searchParams,
}: AdminLeagueDetailPageProps) {
  const { leagueId } = await params;
  const { tab } = await searchParams;

  const activeTab: LeagueSectionTab =
    tab === "sides" || tab === "fixtures" || tab === "standings"
      ? tab
      : "fixtures";

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

  const isFixedDoubles = league.format === "FIXED_DOUBLES";

  type LeagueTeamRow = (typeof league.teams)[number];
  type LeagueMatchRow = (typeof league.matches)[number];

  const sideLabels = isFixedDoubles
    ? ["Fixed doubles teams"]
    : Array.from(
        new Set(
          league.teams.map(
            (team: LeagueTeamRow) => team.originLabel ?? "Teams",
          ),
        ),
      );

  const sides = sideLabels.map((sideLabel, sideIndex) => ({
    id: `${league.id}-${sideLabel}`,
    name: sideLabel,
    sideOrder: sideIndex + 1,
    entries: league.teams
      .filter((team: LeagueTeamRow) =>
        isFixedDoubles ? true : (team.originLabel ?? "Teams") === sideLabel,
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
      sets: match.sets.map((set: LeagueMatchRow["sets"][number]) => ({
        id: set.id,
        setNumber: set.setNumber,
        entryAScore: set.teamAScore,
        entryBScore: set.teamBScore,
      })),
    };
  });

  const formatLabel = formatLeagueFormat(league.format);
  const playedAtLabel = formatLeagueDate(league.playedAt);

  const entryCount = sides.reduce(
    (total, side) => total + side.entries.length,
    0,
  );

  const entryStatLabel = isFixedDoubles ? "Teams" : "Pairs";

  return (
    <>
      <HeaderSurface
        title={league.title}
        variant="league"
        meta={
          <>
            <span className="shrink-0 font-semibold text-primary">
              {formatLabel}
            </span>
            <span className="shrink-0 text-white/25">•</span>
            <span className="shrink-0 text-muted-foreground">
              {playedAtLabel}
            </span>
          </>
        }
        summary={
          <>
            {!isFixedDoubles ? (
              <CompactStatPill label="Sides" value={sides.length} />
            ) : null}
            <CompactStatPill label={entryStatLabel} value={entryCount} />
            <CompactStatPill label="Fixtures" value={matches.length} />
          </>
        }
      >
        <LeagueSectionTabs
          leagueId={league.id}
          activeTab={activeTab}
          leagueFormat={league.format}
        />
      </HeaderSurface>

      <PageContainer className="pt-4 pb-4 sm:pt-5 sm:pb-5">
        <LeagueDetailSections
          leagueId={league.id}
          activeTab={activeTab}
          leagueFormat={league.format}
          sides={sides}
          matches={matches}
          playerStats={league.playerStats}
        />
      </PageContainer>
    </>
  );
}
