"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export type LeagueResultActionState = {
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
  teamAId: string,
  teamBId: string,
) {
  let teamASetWins = 0;
  let teamBSetWins = 0;

  for (const set of sets) {
    if (set.entryAScore > set.entryBScore) {
      teamASetWins += 1;
    } else {
      teamBSetWins += 1;
    }
  }

  if (teamASetWins === teamBSetWins) {
    return null;
  }

  return teamASetWins > teamBSetWins ? teamAId : teamBId;
}

function validateAndParseSets(formData: FormData) {
  const fieldErrors: LeagueResultActionState["fieldErrors"] = {};

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

export async function recordLeagueResultAction(
  _prevState: LeagueResultActionState,
  formData: FormData,
): Promise<LeagueResultActionState> {
  await requireAdmin();

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

  const match = await prisma.leagueMatch.findFirst({
    where: {
      id: matchId,
      leagueId,
    },
    select: {
      id: true,
      leagueId: true,
      teamAId: true,
      teamBId: true,
    },
  });

  if (!match || !match.teamAId || !match.teamBId) {
    return {
      success: false,
      message: "Fixture could not be found.",
      fieldErrors: {},
    };
  }

  const winnerTeamId = getWinnerFromSets(sets, match.teamAId, match.teamBId);

  if (!winnerTeamId) {
    return {
      success: false,
      message: "Set wins are tied. Add a deciding set or adjust the scores.",
      fieldErrors: {
        set3EntryBScore: ["A winner is required."],
      },
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.leagueMatch.update({
      where: {
        id: match.id,
      },
      data: {
        winnerTeamId,
        scoreSummary: buildScoreSummary(sets),
      },
    });

    await tx.leagueSet.deleteMany({
      where: {
        matchId: match.id,
      },
    });

    await tx.leagueSet.createMany({
      data: sets.map((set) => ({
        matchId: match.id,
        setNumber: set.setNumber,
        teamAScore: set.entryAScore,
        teamBScore: set.entryBScore,
      })),
    });

    await recalculateLeaguePlayerStats(tx, leagueId);
  });

  revalidatePath(`/admin/leagues/${leagueId}`);

  return {
    success: true,
    message: "Fixture result saved.",
    fieldErrors: {},
  };
}

export async function resetLeagueResultAction(formData: FormData) {
  await requireAdmin();

  const leagueId = getStringValue(formData, "leagueId");
  const matchId = getStringValue(formData, "matchId");

  const match = await prisma.leagueMatch.findFirst({
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

  await prisma.$transaction(async (tx) => {
    await tx.leagueMatch.update({
      where: {
        id: match.id,
      },
      data: {
        winnerTeamId: null,
        scoreSummary: null,
      },
    });

    await tx.leagueSet.deleteMany({
      where: {
        matchId: match.id,
      },
    });

    await recalculateLeaguePlayerStats(tx, leagueId);
  });

  revalidatePath(`/admin/leagues/${leagueId}`);

  return {
    success: true,
    message: "Fixture result reset.",
  };
}

export async function deleteLeagueAction(formData: FormData) {
  await requireAdmin();

  const leagueId = getStringValue(formData, "leagueId");

  const league = await prisma.league.findUnique({
    where: {
      id: leagueId,
    },
    select: {
      id: true,
      matches: {
        select: {
          winnerTeamId: true,
        },
      },
    },
  });

  if (!league) {
    return {
      success: false,
      message: "Community league could not be found.",
    };
  }

  const hasRecordedResults = league.matches.some((match) =>
    Boolean(match.winnerTeamId),
  );

  if (hasRecordedResults) {
    return {
      success: false,
      message: "Reset recorded results before deleting this league.",
    };
  }

  await prisma.league.delete({
    where: {
      id: league.id,
    },
  });

  revalidatePath("/admin/leagues");
  redirect("/admin/leagues");
}

async function recalculateLeaguePlayerStats(
  tx: Prisma.TransactionClient,
  leagueId: string,
) {
  const completedMatches = await tx.leagueMatch.findMany({
    where: {
      leagueId,
      winnerTeamId: {
        not: null,
      },
    },
    select: {
      winnerTeamId: true,
      teamAId: true,
      teamBId: true,
      sets: {
        orderBy: {
          setNumber: "asc",
        },
        select: {
          teamAScore: true,
          teamBScore: true,
        },
      },
      teamA: {
        select: {
          players: {
            select: {
              playerId: true,
            },
          },
        },
      },
      teamB: {
        select: {
          players: {
            select: {
              playerId: true,
            },
          },
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

  function getTeamPlayerIds(team: {
    players: {
      playerId: string;
    }[];
  }) {
    return team.players.map((teamPlayer) => teamPlayer.playerId);
  }

  for (const match of completedMatches) {
    if (
      !match.winnerTeamId ||
      !match.teamA ||
      !match.teamB ||
      match.sets.length === 0
    ) {
      continue;
    }

    const teamAPlayerIds = getTeamPlayerIds(match.teamA);
    const teamBPlayerIds = getTeamPlayerIds(match.teamB);
    const teamAWon = match.winnerTeamId === match.teamAId;

    const teamAPointsFor = match.sets.reduce(
      (total, set) => total + set.teamAScore,
      0,
    );
    const teamAPointsAgainst = match.sets.reduce(
      (total, set) => total + set.teamBScore,
      0,
    );
    const teamBPointsFor = teamAPointsAgainst;
    const teamBPointsAgainst = teamAPointsFor;

    for (const playerId of teamAPlayerIds) {
      const stat = ensureStat(playerId);

      stat.matchesPlayed += 1;
      stat.pointsFor += teamAPointsFor;
      stat.pointsAgainst += teamAPointsAgainst;

      if (teamAWon) {
        stat.matchesWon += 1;
      } else {
        stat.matchesLost += 1;
      }
    }

    for (const playerId of teamBPlayerIds) {
      const stat = ensureStat(playerId);

      stat.matchesPlayed += 1;
      stat.pointsFor += teamBPointsFor;
      stat.pointsAgainst += teamBPointsAgainst;

      if (teamAWon) {
        stat.matchesLost += 1;
      } else {
        stat.matchesWon += 1;
      }
    }
  }

  await tx.playerLeagueStat.deleteMany({
    where: {
      leagueId,
    },
  });

  if (statMap.size > 0) {
    await tx.playerLeagueStat.createMany({
      data: Array.from(statMap.entries()).map(([playerId, stat]) => ({
        playerId,
        leagueId,
        matchesPlayed: stat.matchesPlayed,
        matchesWon: stat.matchesWon,
        matchesLost: stat.matchesLost,
        pointsFor: stat.pointsFor,
        pointsAgainst: stat.pointsAgainst,
      })),
    });
  }
}
