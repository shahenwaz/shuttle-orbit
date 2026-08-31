"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getAdvanceTarget, getConsolationTarget } from "@/lib/knockout/helpers";

export type RecordMatchResultActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    set1TeamAScore?: string[];
    set1TeamBScore?: string[];
    set2TeamAScore?: string[];
    set2TeamBScore?: string[];
    set3TeamAScore?: string[];
    set3TeamBScore?: string[];
  };
};

export type ResetMatchResultActionState = {
  success: boolean;
  message: string;
};

type KnockoutStageType =
  "quarter_final" | "semi_final" | "final" | "third_place";

type RecordedSetInput = {
  setNumber: number;
  teamAScore: number;
  teamBScore: number;
};

type DownstreamTarget = {
  nextStageType: "semi_final" | "final" | "third_place";
  nextMatchNumber: number;
  nextSlot: "teamAId" | "teamBId";
};

type DownstreamParticipantTarget = DownstreamTarget & {
  participantId: string;
};

const optionalScoreSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return value;
}, z.coerce.number().int().min(0).optional());

const recordMatchResultSchema = z.object({
  tournamentId: z.cuid(),
  categoryId: z.cuid(),
  matchId: z.cuid(),
  set1TeamAScore: z.coerce.number().int().min(0, "Score must be 0 or more."),
  set1TeamBScore: z.coerce.number().int().min(0, "Score must be 0 or more."),
  set2TeamAScore: optionalScoreSchema,
  set2TeamBScore: optionalScoreSchema,
  set3TeamAScore: optionalScoreSchema,
  set3TeamBScore: optionalScoreSchema,
});

const resetMatchResultSchema = z.object({
  tournamentId: z.cuid(),
  categoryId: z.cuid(),
  matchId: z.cuid(),
});

function revalidateResultPaths(tournamentId: string, categoryId: string) {
  revalidatePath(`/admin/tournaments/${tournamentId}`);
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/results`,
  );
  revalidatePath(`/tournaments`);
}

function hasBothScores(a?: number, b?: number) {
  return a !== undefined && b !== undefined;
}

function hasOneScoreOnly(a?: number, b?: number) {
  return (
    (a !== undefined && b === undefined) || (a === undefined && b !== undefined)
  );
}

function isKnockoutStageType(
  stageType: string,
): stageType is KnockoutStageType {
  return ["quarter_final", "semi_final", "final", "third_place"].includes(
    stageType,
  );
}

function hasRecordedResult(match: {
  status: string;
  winnerId: string | null;
  scoreSummary: string | null;
  sets: Array<{ id: string }>;
}) {
  return (
    match.status === "completed" ||
    match.winnerId !== null ||
    match.scoreSummary !== null ||
    match.sets.length > 0
  );
}

function getMatchNumber(roundLabel: string | null) {
  return Number(roundLabel?.match(/\d+/)?.[0] ?? "1");
}

function getDownstreamRoundLabel(target: DownstreamTarget) {
  if (target.nextStageType === "final") {
    return "Final";
  }

  if (target.nextStageType === "third_place") {
    return "Third Place";
  }

  return `Semi Final ${target.nextMatchNumber}`;
}

function getDownstreamTargets(
  stageType: KnockoutStageType,
  roundLabel: string | null,
  winnerId: string,
  loserId: string,
): DownstreamParticipantTarget[] {
  const matchNumber = getMatchNumber(roundLabel);
  const targets: DownstreamParticipantTarget[] = [];
  const winnerTarget = getAdvanceTarget(stageType, matchNumber);

  if (winnerTarget) {
    targets.push({
      ...winnerTarget,
      participantId: winnerId,
    });
  }

  const consolationTarget = getConsolationTarget(stageType, matchNumber);

  if (consolationTarget) {
    targets.push({
      ...consolationTarget,
      participantId: loserId,
    });
  }

  return targets;
}

async function resolveDownstreamMatches<T extends DownstreamTarget>(
  tx: Prisma.TransactionClient,
  categoryId: string,
  targets: T[],
) {
  const resolvedMatches = [];

  for (const target of targets) {
    const stage = await tx.stage.findFirst({
      where: {
        categoryId,
        stageType: target.nextStageType,
      },
      select: {
        id: true,
      },
    });

    if (!stage) {
      continue;
    }

    const match = await tx.match.findFirst({
      where: {
        categoryId,
        stageId: stage.id,
        roundLabel: getDownstreamRoundLabel(target),
      },
      include: {
        sets: {
          select: {
            id: true,
          },
        },
      },
    });

    if (match) {
      resolvedMatches.push({ target, match });
    }
  }

  return resolvedMatches;
}

export async function recordMatchResultAction(
  _prevState: RecordMatchResultActionState,
  formData: FormData,
): Promise<RecordMatchResultActionState> {
  await requireAdmin();

  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    matchId: formData.get("matchId"),
    set1TeamAScore: formData.get("set1TeamAScore"),
    set1TeamBScore: formData.get("set1TeamBScore"),
    set2TeamAScore: formData.get("set2TeamAScore"),
    set2TeamBScore: formData.get("set2TeamBScore"),
    set3TeamAScore: formData.get("set3TeamAScore"),
    set3TeamBScore: formData.get("set3TeamBScore"),
  };

  const parsed = recordMatchResultSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const {
    tournamentId,
    categoryId,
    matchId,
    set1TeamAScore,
    set1TeamBScore,
    set2TeamAScore,
    set2TeamBScore,
    set3TeamAScore,
    set3TeamBScore,
  } = parsed.data;

  if (set1TeamAScore === set1TeamBScore) {
    return {
      success: false,
      message: "Set 1 cannot end in a draw.",
      fieldErrors: {
        set1TeamBScore: ["Enter a score that produces a winner."],
      },
    };
  }

  if (hasOneScoreOnly(set2TeamAScore, set2TeamBScore)) {
    return {
      success: false,
      message: "Please complete both scores for Set 2.",
      fieldErrors: {
        set2TeamBScore: ["Both scores are required if Set 2 is used."],
      },
    };
  }

  if (hasOneScoreOnly(set3TeamAScore, set3TeamBScore)) {
    return {
      success: false,
      message: "Please complete both scores for Set 3.",
      fieldErrors: {
        set3TeamBScore: ["Both scores are required if Set 3 is used."],
      },
    };
  }

  if (
    hasBothScores(set2TeamAScore, set2TeamBScore) &&
    set2TeamAScore === set2TeamBScore
  ) {
    return {
      success: false,
      message: "Set 2 cannot end in a draw.",
      fieldErrors: {
        set2TeamBScore: ["Enter a score that produces a winner."],
      },
    };
  }

  if (
    hasBothScores(set3TeamAScore, set3TeamBScore) &&
    set3TeamAScore === set3TeamBScore
  ) {
    return {
      success: false,
      message: "Set 3 cannot end in a draw.",
      fieldErrors: {
        set3TeamBScore: ["Enter a score that produces a winner."],
      },
    };
  }

  const sets: RecordedSetInput[] = [
    {
      setNumber: 1,
      teamAScore: set1TeamAScore,
      teamBScore: set1TeamBScore,
    },
  ];

  if (set2TeamAScore !== undefined && set2TeamBScore !== undefined) {
    sets.push({
      setNumber: 2,
      teamAScore: set2TeamAScore,
      teamBScore: set2TeamBScore,
    });
  }

  if (set3TeamAScore !== undefined && set3TeamBScore !== undefined) {
    sets.push({
      setNumber: 3,
      teamAScore: set3TeamAScore,
      teamBScore: set3TeamBScore,
    });
  }

  let teamASetWins = 0;
  let teamBSetWins = 0;

  for (const set of sets) {
    if (set.teamAScore > set.teamBScore) {
      teamASetWins += 1;
    } else {
      teamBSetWins += 1;
    }
  }

  if (teamASetWins === teamBSetWins) {
    return {
      success: false,
      message: "The result must produce one overall winner.",
      fieldErrors: {
        set3TeamBScore: ["Enter scores that produce an overall winner."],
      },
    };
  }

  const scoreSummary =
    sets.length === 1
      ? `${sets[0].teamAScore} - ${sets[0].teamBScore}`
      : `${teamASetWins} - ${teamBSetWins}`;

  const transactionResult = await prisma.$transaction(async (tx) => {
    const match = await tx.match.findFirst({
      where: {
        id: matchId,
        tournamentId,
        categoryId,
      },
      include: {
        stage: {
          select: {
            stageType: true,
          },
        },
        sets: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!match) {
      return { status: "not_found" as const };
    }

    if (!match.teamAId || !match.teamBId) {
      return { status: "teams_missing" as const };
    }

    const winnerId =
      teamASetWins > teamBSetWins ? match.teamAId : match.teamBId;
    const loserId = winnerId === match.teamAId ? match.teamBId : match.teamAId;
    const downstreamTargets = isKnockoutStageType(match.stage.stageType)
      ? getDownstreamTargets(
          match.stage.stageType,
          match.roundLabel,
          winnerId,
          loserId,
        )
      : [];
    const downstreamMatches = await resolveDownstreamMatches(
      tx,
      categoryId,
      downstreamTargets,
    );
    const isChangingExistingWinner =
      hasRecordedResult(match) && match.winnerId !== winnerId;

    if (
      isChangingExistingWinner &&
      downstreamMatches.some(({ match: downstreamMatch }) =>
        hasRecordedResult(downstreamMatch),
      )
    ) {
      return { status: "downstream_completed" as const };
    }

    await tx.match.update({
      where: {
        id: match.id,
      },
      data: {
        scoreSummary,
        winnerId,
        status: "completed",
      },
    });

    await tx.matchSet.deleteMany({
      where: {
        matchId: match.id,
      },
    });

    await tx.matchSet.createMany({
      data: sets.map((set) => ({
        matchId: match.id,
        setNumber: set.setNumber,
        teamAScore: set.teamAScore,
        teamBScore: set.teamBScore,
      })),
    });

    for (const { target, match: downstreamMatch } of downstreamMatches) {
      await tx.match.update({
        where: {
          id: downstreamMatch.id,
        },
        data: {
          [target.nextSlot]: target.participantId,
        },
      });
    }

    return { status: "saved" as const };
  });

  if (transactionResult.status === "not_found") {
    return {
      success: false,
      message: "Match not found.",
    };
  }

  if (transactionResult.status === "teams_missing") {
    return {
      success: false,
      message: "Both teams must be assigned before recording a result.",
    };
  }

  if (transactionResult.status === "downstream_completed") {
    return {
      success: false,
      message:
        "Reset the affected downstream knockout result before changing this winner.",
    };
  }

  revalidateResultPaths(tournamentId, categoryId);

  return {
    success: true,
    message: "Match result saved successfully.",
    fieldErrors: {},
  };
}

export async function resetMatchResultAction(
  formData: FormData,
): Promise<ResetMatchResultActionState> {
  await requireAdmin();

  const parsed = resetMatchResultSchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    matchId: formData.get("matchId"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid result reset request.",
    };
  }

  const { tournamentId, categoryId, matchId } = parsed.data;

  const transactionResult = await prisma.$transaction(async (tx) => {
    const match = await tx.match.findFirst({
      where: {
        id: matchId,
        tournamentId,
        categoryId,
      },
      include: {
        stage: {
          select: {
            stageType: true,
          },
        },
        sets: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!match) {
      return { status: "not_found" as const };
    }

    if (!hasRecordedResult(match)) {
      return { status: "no_result" as const };
    }

    const downstreamTargets: DownstreamTarget[] = [];

    if (isKnockoutStageType(match.stage.stageType) && match.winnerId) {
      const matchNumber = getMatchNumber(match.roundLabel);
      const winnerTarget = getAdvanceTarget(match.stage.stageType, matchNumber);
      const consolationTarget = getConsolationTarget(
        match.stage.stageType,
        matchNumber,
      );

      if (winnerTarget) {
        downstreamTargets.push(winnerTarget);
      }

      if (consolationTarget) {
        downstreamTargets.push(consolationTarget);
      }
    }

    const downstreamMatches = await resolveDownstreamMatches(
      tx,
      categoryId,
      downstreamTargets,
    );

    if (
      downstreamMatches.some(({ match: downstreamMatch }) =>
        hasRecordedResult(downstreamMatch),
      )
    ) {
      return { status: "downstream_completed" as const };
    }

    for (const { target, match: downstreamMatch } of downstreamMatches) {
      const shouldClearAdvancedTeam =
        (target.nextSlot === "teamAId" && downstreamMatch.teamAId !== null) ||
        (target.nextSlot === "teamBId" && downstreamMatch.teamBId !== null);

      if (shouldClearAdvancedTeam) {
        await tx.match.update({
          where: {
            id: downstreamMatch.id,
          },
          data: {
            [target.nextSlot]: null,
          },
        });
      }
    }

    await tx.match.update({
      where: {
        id: match.id,
      },
      data: {
        winnerId: null,
        scoreSummary: null,
        status: "scheduled",
      },
    });

    await tx.matchSet.deleteMany({
      where: {
        matchId: match.id,
      },
    });

    return { status: "reset" as const };
  });

  if (transactionResult.status === "not_found") {
    return {
      success: false,
      message: "Match not found.",
    };
  }

  if (transactionResult.status === "no_result") {
    return {
      success: false,
      message: "This match does not have a recorded result yet.",
    };
  }

  if (transactionResult.status === "downstream_completed") {
    return {
      success: false,
      message:
        "You cannot reset this result because a downstream knockout match already has a recorded result. Reset the downstream result first.",
    };
  }

  revalidateResultPaths(tournamentId, categoryId);

  return {
    success: true,
    message: "Match result reset successfully.",
  };
}
