"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";

export type ClubLeagueResultActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    set1EntryAScore?: string[];
    set1EntryBScore?: string[];
    set2EntryAScore?: string[];
    set2EntryBScore?: string[];
    set3EntryAScore?: string[];
    set3EntryBScore?: string[];
  };
};

type ParsedSetScore = {
  setNumber: number;
  entryAScore: number;
  entryBScore: number;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalScore(formData: FormData, key: string) {
  const value = getStringValue(formData, key);

  if (!value) {
    return null;
  }

  const score = Number(value);

  if (!Number.isInteger(score) || score < 0) {
    return null;
  }

  return score;
}

function buildScoreSummary(sets: ParsedSetScore[]) {
  return sets.map((set) => `${set.entryAScore}-${set.entryBScore}`).join(", ");
}

function getWinnerFromSets(
  sets: ParsedSetScore[],
  entryAId: string,
  entryBId: string,
) {
  let entryASetWins = 0;
  let entryBSetWins = 0;

  for (const set of sets) {
    if (set.entryAScore > set.entryBScore) {
      entryASetWins += 1;
    } else {
      entryBSetWins += 1;
    }
  }

  if (entryASetWins === entryBSetWins) {
    return null;
  }

  return entryASetWins > entryBSetWins ? entryAId : entryBId;
}

function validateAndParseSets(formData: FormData) {
  const fieldErrors: ClubLeagueResultActionState["fieldErrors"] = {};

  const rawSets = [
    {
      setNumber: 1,
      entryAKey: "set1EntryAScore",
      entryBKey: "set1EntryBScore",
      entryAScore: getOptionalScore(formData, "set1EntryAScore"),
      entryBScore: getOptionalScore(formData, "set1EntryBScore"),
      required: true,
    },
    {
      setNumber: 2,
      entryAKey: "set2EntryAScore",
      entryBKey: "set2EntryBScore",
      entryAScore: getOptionalScore(formData, "set2EntryAScore"),
      entryBScore: getOptionalScore(formData, "set2EntryBScore"),
      required: false,
    },
    {
      setNumber: 3,
      entryAKey: "set3EntryAScore",
      entryBKey: "set3EntryBScore",
      entryAScore: getOptionalScore(formData, "set3EntryAScore"),
      entryBScore: getOptionalScore(formData, "set3EntryBScore"),
      required: false,
    },
  ] as const;

  const sets: ParsedSetScore[] = [];

  for (const rawSet of rawSets) {
    const hasEntryAScore = getStringValue(formData, rawSet.entryAKey) !== "";
    const hasEntryBScore = getStringValue(formData, rawSet.entryBKey) !== "";
    const hasAnyScore = hasEntryAScore || hasEntryBScore;

    if (rawSet.required && !hasAnyScore) {
      fieldErrors[rawSet.entryAKey] = ["Set 1 score is required."];
      fieldErrors[rawSet.entryBKey] = ["Set 1 score is required."];
      continue;
    }

    if (!rawSet.required && !hasAnyScore) {
      continue;
    }

    if (rawSet.entryAScore === null) {
      fieldErrors[rawSet.entryAKey] = ["Enter a valid score."];
    }

    if (rawSet.entryBScore === null) {
      fieldErrors[rawSet.entryBKey] = ["Enter a valid score."];
    }

    if (rawSet.entryAScore === null || rawSet.entryBScore === null) {
      continue;
    }

    if (rawSet.entryAScore === rawSet.entryBScore) {
      fieldErrors[rawSet.entryBKey] = ["A set cannot end in a draw."];
      continue;
    }

    sets.push({
      setNumber: rawSet.setNumber,
      entryAScore: rawSet.entryAScore,
      entryBScore: rawSet.entryBScore,
    });
  }

  return {
    sets,
    fieldErrors,
  };
}

export async function recordClubLeagueResultAction(
  _prevState: ClubLeagueResultActionState,
  formData: FormData,
): Promise<ClubLeagueResultActionState> {
  const leagueId = getStringValue(formData, "leagueId");
  const matchId = getStringValue(formData, "matchId");

  const { sets, fieldErrors } = validateAndParseSets(formData);

  if (Object.keys(fieldErrors).length > 0 || sets.length === 0) {
    return {
      success: false,
      message: "Please fix the score fields.",
      fieldErrors,
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

  const winnerEntryId = getWinnerFromSets(sets, match.entryAId, match.entryBId);

  if (!winnerEntryId) {
    return {
      success: false,
      message: "Set wins are tied. Add a deciding set or adjust the scores.",
      fieldErrors: {
        set3EntryBScore: ["A winner is required."],
      },
    };
  }

  await prisma.$transaction([
    prisma.clubLeagueMatch.update({
      where: {
        id: match.id,
      },
      data: {
        winnerEntryId,
        scoreSummary: buildScoreSummary(sets),
      },
    }),
    prisma.clubLeagueSet.deleteMany({
      where: {
        matchId: match.id,
      },
    }),
    ...sets.map((set) =>
      prisma.clubLeagueSet.create({
        data: {
          matchId: match.id,
          setNumber: set.setNumber,
          entryAScore: set.entryAScore,
          entryBScore: set.entryBScore,
        },
      }),
    ),
  ]);

  await recalculateClubLeaguePlayerStats(leagueId);

  revalidatePath(`/admin/club-leagues/${leagueId}`);

  return {
    success: true,
    message: "Fixture result saved.",
    fieldErrors: {},
  };
}

export async function resetClubLeagueResultAction(formData: FormData) {
  const leagueId = getStringValue(formData, "leagueId");
  const matchId = getStringValue(formData, "matchId");

  const match = await prisma.clubLeagueMatch.findFirst({
    where: {
      id: matchId,
      leagueId,
    },
    select: {
      id: true,
    },
  });

  if (!match) {
    return {
      success: false,
      message: "Fixture could not be found.",
    };
  }

  await prisma.$transaction([
    prisma.clubLeagueMatch.update({
      where: {
        id: match.id,
      },
      data: {
        winnerEntryId: null,
        scoreSummary: null,
      },
    }),
    prisma.clubLeagueSet.deleteMany({
      where: {
        matchId: match.id,
      },
    }),
  ]);

  await recalculateClubLeaguePlayerStats(leagueId);

  revalidatePath(`/admin/club-leagues/${leagueId}`);

  return {
    success: true,
    message: "Fixture result reset.",
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
    if (
      !match.winnerEntryId ||
      !match.entryA ||
      !match.entryB ||
      match.sets.length === 0
    ) {
      continue;
    }

    const entryAPlayerIds = getEntryPlayerIds(match.entryA);
    const entryBPlayerIds = getEntryPlayerIds(match.entryB);
    const entryAWon = match.winnerEntryId === match.entryAId;

    const entryAPointsFor = match.sets.reduce(
      (total, set) => total + set.entryAScore,
      0,
    );
    const entryAPointsAgainst = match.sets.reduce(
      (total, set) => total + set.entryBScore,
      0,
    );
    const entryBPointsFor = entryAPointsAgainst;
    const entryBPointsAgainst = entryAPointsFor;

    for (const playerId of entryAPlayerIds) {
      const stat = ensureStat(playerId);

      stat.matchesPlayed += 1;
      stat.pointsFor += entryAPointsFor;
      stat.pointsAgainst += entryAPointsAgainst;

      if (entryAWon) {
        stat.matchesWon += 1;
      } else {
        stat.matchesLost += 1;
      }
    }

    for (const playerId of entryBPlayerIds) {
      const stat = ensureStat(playerId);

      stat.matchesPlayed += 1;
      stat.pointsFor += entryBPointsFor;
      stat.pointsAgainst += entryBPointsAgainst;

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
