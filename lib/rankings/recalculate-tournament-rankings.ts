import { Prisma, type PlacementTier } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import {
  getBasePointsForPlacement,
  getCategoryMultiplier,
  getTotalRankingPoints,
  type RankingPlacementTier,
} from "@/lib/rankings/constants";
import {
  getFinishLabel,
  isFinalRound,
  isSemiFinalRound,
  isThirdPlaceRound,
} from "@/lib/rankings/placements";

type TeamAggregate = {
  teamEntryId: string;
  playerIds: [string, string];
  matchesPlayed: number;
  matchesWon: number;
  setsWon: number;
  setsLost: number;
  pointsFor: number;
  pointsAgainst: number;
  playedAnyMatch: boolean;
  reachedAdvancedStage: boolean;
};

function createEmptyAggregate(
  teamEntryId: string,
  player1Id: string,
  player2Id: string,
): TeamAggregate {
  return {
    teamEntryId,
    playerIds: [player1Id, player2Id],
    matchesPlayed: 0,
    matchesWon: 0,
    setsWon: 0,
    setsLost: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    playedAnyMatch: false,
    reachedAdvancedStage: false,
  };
}

function updateAggregateFromMatch(
  aggregate: TeamAggregate,
  match: {
    teamAId: string | null;
    teamBId: string | null;
    winnerId: string | null;
    sets: Array<{
      teamAScore: number;
      teamBScore: number;
    }>;
    stage: {
      stageOrder: number;
      stageType: string;
    };
  },
) {
  const isTeamA = match.teamAId === aggregate.teamEntryId;
  const isTeamB = match.teamBId === aggregate.teamEntryId;

  if (!isTeamA && !isTeamB) {
    return;
  }

  aggregate.playedAnyMatch = true;
  aggregate.matchesPlayed += 1;

  if (match.winnerId === aggregate.teamEntryId) {
    aggregate.matchesWon += 1;
  }

  if (match.stage.stageOrder > 1 || match.stage.stageType !== "round_robin") {
    aggregate.reachedAdvancedStage = true;
  }

  for (const set of match.sets) {
    const teamScore = isTeamA ? set.teamAScore : set.teamBScore;
    const opponentScore = isTeamA ? set.teamBScore : set.teamAScore;

    aggregate.pointsFor += teamScore;
    aggregate.pointsAgainst += opponentScore;

    if (teamScore > opponentScore) {
      aggregate.setsWon += 1;
    } else if (teamScore < opponentScore) {
      aggregate.setsLost += 1;
    }
  }
}

function assignPlacement(
  placements: Map<string, PlacementTier>,
  teamEntryId: string | null,
  placement: PlacementTier,
) {
  if (!teamEntryId) {
    return;
  }

  if (!placements.has(teamEntryId)) {
    placements.set(teamEntryId, placement);
  }
}

export async function recalculateTournamentRankings(tournamentId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: {
      id: true,
      eventDate: true,
      categories: {
        select: {
          id: true,
          code: true,
          teamEntries: {
            select: {
              id: true,
              player1Id: true,
              player2Id: true,
            },
          },
          matches: {
            where: {
              status: "completed",
            },
            select: {
              id: true,
              roundLabel: true,
              teamAId: true,
              teamBId: true,
              winnerId: true,
              stage: {
                select: {
                  stageOrder: true,
                  stageType: true,
                },
              },
              sets: {
                select: {
                  teamAScore: true,
                  teamBScore: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!tournament) {
    throw new Error("Tournament not found.");
  }

  const playerStatsRows: Prisma.PlayerTournamentStatCreateManyInput[] = [];
  const rankingLedgerRows: Prisma.RankingLedgerCreateManyInput[] = [];

  for (const category of tournament.categories) {
    const aggregateMap = new Map<string, TeamAggregate>();

    for (const teamEntry of category.teamEntries) {
      aggregateMap.set(
        teamEntry.id,
        createEmptyAggregate(
          teamEntry.id,
          teamEntry.player1Id,
          teamEntry.player2Id,
        ),
      );
    }

    for (const match of category.matches) {
      if (match.teamAId) {
        const aggregate = aggregateMap.get(match.teamAId);

        if (aggregate) {
          updateAggregateFromMatch(aggregate, match);
        }
      }

      if (match.teamBId) {
        const aggregate = aggregateMap.get(match.teamBId);

        if (aggregate) {
          updateAggregateFromMatch(aggregate, match);
        }
      }
    }

    const placements = new Map<string, PlacementTier>();

    const finalMatch = category.matches.find((match) =>
      isFinalRound(match.roundLabel),
    );
    const thirdPlaceMatch = category.matches.find((match) =>
      isThirdPlaceRound(match.roundLabel),
    );
    const semiFinalMatches = category.matches.filter((match) =>
      isSemiFinalRound(match.roundLabel),
    );

    if (finalMatch) {
      assignPlacement(placements, finalMatch.winnerId, "CHAMPION");

      const runnerUpId =
        finalMatch.teamAId === finalMatch.winnerId
          ? finalMatch.teamBId
          : finalMatch.teamAId;

      assignPlacement(placements, runnerUpId, "RUNNER_UP");
    }

    if (thirdPlaceMatch) {
      assignPlacement(placements, thirdPlaceMatch.winnerId, "THIRD_PLACE");

      const fourthPlaceId =
        thirdPlaceMatch.teamAId === thirdPlaceMatch.winnerId
          ? thirdPlaceMatch.teamBId
          : thirdPlaceMatch.teamAId;

      assignPlacement(placements, fourthPlaceId, "FOURTH_PLACE");
    } else {
      for (const match of semiFinalMatches) {
        const loserId =
          match.teamAId === match.winnerId ? match.teamBId : match.teamAId;

        assignPlacement(placements, loserId, "SEMI_FINALIST");
      }
    }

    for (const [teamEntryId, aggregate] of aggregateMap) {
      let placementTier = placements.get(teamEntryId);

      if (!placementTier) {
        if (aggregate.reachedAdvancedStage) {
          placementTier = "ADVANCED_STAGE";
        } else if (aggregate.playedAnyMatch) {
          placementTier = "GROUP_STAGE";
        } else {
          placementTier = "PARTICIPATION";
        }
      }

      const rankingPlacementTier = placementTier as RankingPlacementTier;
      const basePoints = getBasePointsForPlacement(rankingPlacementTier);
      const multiplier = getCategoryMultiplier(category.code);
      const totalPoints = getTotalRankingPoints(
        rankingPlacementTier,
        category.code,
      );
      const finishLabel = getFinishLabel(placementTier);

      for (const playerId of aggregate.playerIds) {
        playerStatsRows.push({
          playerId,
          tournamentId: tournament.id,
          categoryId: category.id,
          teamEntryId,
          placementTier,
          finishLabel,
          matchesPlayed: aggregate.matchesPlayed,
          matchesWon: aggregate.matchesWon,
          setsWon: aggregate.setsWon,
          setsLost: aggregate.setsLost,
          pointsFor: aggregate.pointsFor,
          pointsAgainst: aggregate.pointsAgainst,
          rankingPoints: totalPoints,
        });

        rankingLedgerRows.push({
          playerId,
          tournamentId: tournament.id,
          categoryId: category.id,
          scope: "CATEGORY",
          categoryCode: category.code,
          placementTier,
          basePoints,
          multiplierApplied: multiplier,
          totalPointsAwarded: totalPoints,
          notes: `${category.code} result: ${finishLabel}`,
        });

        rankingLedgerRows.push({
          playerId,
          tournamentId: tournament.id,
          categoryId: category.id,
          scope: "UNIVERSAL",
          categoryCode: category.code,
          placementTier,
          basePoints,
          multiplierApplied: multiplier,
          totalPointsAwarded: totalPoints,
          notes: `${category.code} result: ${finishLabel}`,
        });
      }
    }
  }

  await prisma.$transaction([
    prisma.rankingLedger.deleteMany({
      where: {
        tournamentId,
      },
    }),
    prisma.playerTournamentStat.deleteMany({
      where: {
        tournamentId,
      },
    }),
    ...(playerStatsRows.length > 0
      ? [prisma.playerTournamentStat.createMany({ data: playerStatsRows })]
      : []),
    ...(rankingLedgerRows.length > 0
      ? [prisma.rankingLedger.createMany({ data: rankingLedgerRows })]
      : []),
  ]);

  return {
    success: true,
    playerStatsCreated: playerStatsRows.length,
    rankingLedgerCreated: rankingLedgerRows.length,
  };
}
