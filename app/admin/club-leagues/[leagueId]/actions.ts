"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";

export type ClubLeagueResultActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    entryAScore?: string[];
    entryBScore?: string[];
  };
};

const initialFieldErrors: ClubLeagueResultActionState["fieldErrors"] = {};

function getScore(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const score = Number(value);

  if (!Number.isInteger(score) || score < 0) {
    return null;
  }

  return score;
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function recordClubLeagueResultAction(
  _prevState: ClubLeagueResultActionState,
  formData: FormData,
): Promise<ClubLeagueResultActionState> {
  const leagueId = getStringValue(formData, "leagueId");
  const matchId = getStringValue(formData, "matchId");
  const entryAScore = getScore(formData, "entryAScore");
  const entryBScore = getScore(formData, "entryBScore");

  const fieldErrors: ClubLeagueResultActionState["fieldErrors"] = {
    ...initialFieldErrors,
  };

  if (entryAScore === null) {
    fieldErrors.entryAScore = ["Enter a valid score."];
  }

  if (entryBScore === null) {
    fieldErrors.entryBScore = ["Enter a valid score."];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "Please fix the score fields.",
      fieldErrors,
    };
  }

  if (entryAScore === null || entryBScore === null) {
    return {
      success: false,
      message: "Please fix the score fields.",
      fieldErrors,
    };
  }

  const safeEntryAScore = entryAScore;
  const safeEntryBScore = entryBScore;

  if (safeEntryAScore === safeEntryBScore) {
    return {
      success: false,
      message: "A club league fixture cannot end in a draw.",
      fieldErrors: {
        entryBScore: ["Enter a score that produces a winner."],
      },
    };
  }

  const match = await prisma.clubLeagueMatch.findFirst({
    where: {
      id: matchId,
      leagueId,
    },
    select: {
      id: true,
      leagueId: true,
      entryAId: true,
      entryBId: true,
    },
  });

  if (!match || !match.entryAId || !match.entryBId) {
    return {
      success: false,
      message: "Fixture could not be found.",
      fieldErrors: {},
    };
  }

  const winnerEntryId =
    safeEntryAScore > safeEntryBScore ? match.entryAId : match.entryBId;

  await prisma.$transaction([
    prisma.clubLeagueMatch.update({
      where: {
        id: match.id,
      },
      data: {
        winnerEntryId,
        scoreSummary: `${safeEntryAScore}-${safeEntryBScore}`,
      },
    }),
    prisma.clubLeagueSet.deleteMany({
      where: {
        matchId: match.id,
      },
    }),
    prisma.clubLeagueSet.create({
      data: {
        matchId: match.id,
        setNumber: 1,
        entryAScore: safeEntryAScore,
        entryBScore: safeEntryBScore,
      },
    }),
  ]);

  await recalculateClubLeaguePlayerStats(leagueId);

  revalidatePath(`/admin/club-leagues/${leagueId}`);

  return {
    success: true,
    message: "Fixture result saved.",
    fieldErrors: {},
  };
}

async function recalculateClubLeaguePlayerStats(leagueId: string) {
  const completedMatches = await prisma.clubLeagueMatch.findMany({
    where: {
      leagueId,
      winnerEntryId: {
        not: null,
      },
    },
    select: {
      winnerEntryId: true,
      entryAId: true,
      entryBId: true,
      sets: {
        orderBy: {
          setNumber: "asc",
        },
        select: {
          entryAScore: true,
          entryBScore: true,
        },
      },
      entryA: {
        select: {
          player1Id: true,
          player2Id: true,
        },
      },
      entryB: {
        select: {
          player1Id: true,
          player2Id: true,
        },
      },
    },
  });

  const statMap = new Map<
    string,
    {
      matchesPlayed: number;
      matchesWon: number;
      matchesLost: number;
      pointsFor: number;
      pointsAgainst: number;
    }
  >();

  function ensureStat(playerId: string) {
    const existing = statMap.get(playerId);

    if (existing) {
      return existing;
    }

    const created = {
      matchesPlayed: 0,
      matchesWon: 0,
      matchesLost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
    };

    statMap.set(playerId, created);
    return created;
  }

  function getEntryPlayerIds(entry: {
    player1Id: string;
    player2Id: string | null;
  }) {
    return [entry.player1Id, entry.player2Id].filter(
      (playerId): playerId is string => Boolean(playerId),
    );
  }

  for (const match of completedMatches) {
    if (!match.winnerEntryId || match.sets.length === 0) {
      continue;
    }

    const set = match.sets[0];
    if (!match.entryA || !match.entryB) {
      continue;
    }

    const entryAPlayerIds = getEntryPlayerIds(match.entryA);
    const entryBPlayerIds = getEntryPlayerIds(match.entryB);
    const entryAWon = match.winnerEntryId === match.entryAId;

    for (const playerId of entryAPlayerIds) {
      const stat = ensureStat(playerId);

      stat.matchesPlayed += 1;
      stat.pointsFor += set.entryAScore;
      stat.pointsAgainst += set.entryBScore;

      if (entryAWon) {
        stat.matchesWon += 1;
      } else {
        stat.matchesLost += 1;
      }
    }

    for (const playerId of entryBPlayerIds) {
      const stat = ensureStat(playerId);

      stat.matchesPlayed += 1;
      stat.pointsFor += set.entryBScore;
      stat.pointsAgainst += set.entryAScore;

      if (entryAWon) {
        stat.matchesLost += 1;
      } else {
        stat.matchesWon += 1;
      }
    }
  }

  await prisma.$transaction([
    prisma.clubPlayerLeagueStat.deleteMany({
      where: {
        leagueId,
      },
    }),
    ...Array.from(statMap.entries()).map(([playerId, stat]) =>
      prisma.clubPlayerLeagueStat.create({
        data: {
          playerId,
          leagueId,
          matchesPlayed: stat.matchesPlayed,
          matchesWon: stat.matchesWon,
          matchesLost: stat.matchesLost,
          pointsFor: stat.pointsFor,
          pointsAgainst: stat.pointsAgainst,
        },
      }),
    ),
  ]);
}
