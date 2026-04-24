"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export async function recordMatchResultAction(
  _prevState: RecordMatchResultActionState,
  formData: FormData,
): Promise<RecordMatchResultActionState> {
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

  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      tournamentId,
      categoryId,
    },
    include: {
      stage: {
        select: {
          id: true,
          stageType: true,
        },
      },
    },
  });

  if (!match) {
    return {
      success: false,
      message: "Match not found.",
    };
  }

  if (!match.teamAId || !match.teamBId) {
    return {
      success: false,
      message: "Both teams must be assigned before recording a result.",
    };
  }

  const sets = [
    {
      setNumber: 1,
      teamAScore: set1TeamAScore,
      teamBScore: set1TeamBScore,
    },
    ...(hasBothScores(set2TeamAScore, set2TeamBScore)
      ? [
          {
            setNumber: 2,
            teamAScore: set2TeamAScore!,
            teamBScore: set2TeamBScore!,
          },
        ]
      : []),
    ...(hasBothScores(set3TeamAScore, set3TeamBScore)
      ? [
          {
            setNumber: 3,
            teamAScore: set3TeamAScore!,
            teamBScore: set3TeamBScore!,
          },
        ]
      : []),
  ];

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

  const winnerId = teamASetWins > teamBSetWins ? match.teamAId : match.teamBId;
  const loserId = winnerId === match.teamAId ? match.teamBId : match.teamAId;

  const scoreSummary =
    sets.length === 1
      ? `${sets[0].teamAScore} - ${sets[0].teamBScore}`
      : `${teamASetWins} - ${teamBSetWins}`;

  await prisma.$transaction([
    prisma.match.update({
      where: {
        id: matchId,
      },
      data: {
        scoreSummary,
        winnerId,
        status: "completed",
      },
    }),
    prisma.matchSet.deleteMany({
      where: {
        matchId,
      },
    }),
    ...sets.map((set) =>
      prisma.matchSet.create({
        data: {
          matchId,
          setNumber: set.setNumber,
          teamAScore: set.teamAScore,
          teamBScore: set.teamBScore,
        },
      }),
    ),
  ]);

  if (
    match.stage.stageType === "quarter_final" ||
    match.stage.stageType === "semi_final" ||
    match.stage.stageType === "final" ||
    match.stage.stageType === "third_place"
  ) {
    const matchNumber = Number(match.roundLabel?.match(/\d+/)?.[0] ?? "1");

    const winnerTarget = getAdvanceTarget(
      match.stage.stageType as
        | "quarter_final"
        | "semi_final"
        | "final"
        | "third_place",
      matchNumber,
    );

    if (winnerTarget) {
      const nextStage = await prisma.stage.findFirst({
        where: {
          categoryId,
          stageType: winnerTarget.nextStageType,
        },
        select: {
          id: true,
        },
      });

      if (nextStage) {
        const nextRoundLabel =
          winnerTarget.nextStageType === "final"
            ? "Final"
            : `Semi Final ${winnerTarget.nextMatchNumber}`;

        const nextMatch = await prisma.match.findFirst({
          where: {
            categoryId,
            stageId: nextStage.id,
            roundLabel: nextRoundLabel,
          },
          select: {
            id: true,
          },
        });

        if (nextMatch) {
          await prisma.match.update({
            where: {
              id: nextMatch.id,
            },
            data: {
              [winnerTarget.nextSlot]: winnerId,
            },
          });
        }
      }
    }

    const consolationTarget = getConsolationTarget(
      match.stage.stageType as
        | "quarter_final"
        | "semi_final"
        | "final"
        | "third_place",
      matchNumber,
    );

    if (consolationTarget && loserId) {
      const thirdPlaceStage = await prisma.stage.findFirst({
        where: {
          categoryId,
          stageType: consolationTarget.nextStageType,
        },
        select: {
          id: true,
        },
      });

      if (thirdPlaceStage) {
        const thirdPlaceMatch = await prisma.match.findFirst({
          where: {
            categoryId,
            stageId: thirdPlaceStage.id,
            roundLabel: "Third Place",
          },
          select: {
            id: true,
          },
        });

        if (thirdPlaceMatch) {
          await prisma.match.update({
            where: {
              id: thirdPlaceMatch.id,
            },
            data: {
              [consolationTarget.nextSlot]: loserId,
            },
          });
        }
      }
    }
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

  const match = await prisma.match.findFirst({
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
    return {
      success: false,
      message: "Match not found.",
    };
  }

  const hasRecordedResult =
    match.status === "completed" ||
    match.winnerId !== null ||
    match.scoreSummary !== null ||
    match.sets.length > 0;

  if (!hasRecordedResult) {
    return {
      success: false,
      message: "This match does not have a recorded result yet.",
    };
  }

  const isKnockoutStage =
    match.stage.stageType === "quarter_final" ||
    match.stage.stageType === "semi_final" ||
    match.stage.stageType === "final" ||
    match.stage.stageType === "third_place";

  if (isKnockoutStage && match.winnerId) {
    const matchNumber = Number(match.roundLabel?.match(/\d+/)?.[0] ?? "1");

    const winnerTarget = getAdvanceTarget(
      match.stage.stageType as
        | "quarter_final"
        | "semi_final"
        | "final"
        | "third_place",
      matchNumber,
    );

    const consolationTarget = getConsolationTarget(
      match.stage.stageType as
        | "quarter_final"
        | "semi_final"
        | "final"
        | "third_place",
      matchNumber,
    );

    const downstreamTargets = [winnerTarget, consolationTarget].filter(
      Boolean,
    ) as Array<{
      nextStageType: "semi_final" | "final" | "third_place";
      nextMatchNumber: 1 | 2;
      nextSlot: "teamAId" | "teamBId";
    }>;

    for (const target of downstreamTargets) {
      const nextStage = await prisma.stage.findFirst({
        where: {
          categoryId,
          stageType: target.nextStageType,
        },
        select: {
          id: true,
        },
      });

      if (!nextStage) {
        continue;
      }

      const nextRoundLabel =
        target.nextStageType === "final"
          ? "Final"
          : target.nextStageType === "third_place"
            ? "Third Place"
            : `Semi Final ${target.nextMatchNumber}`;

      const nextMatch = await prisma.match.findFirst({
        where: {
          categoryId,
          stageId: nextStage.id,
          roundLabel: nextRoundLabel,
        },
        include: {
          sets: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!nextMatch) {
        continue;
      }

      const nextMatchHasRecordedResult =
        nextMatch.status === "completed" ||
        nextMatch.winnerId !== null ||
        nextMatch.scoreSummary !== null ||
        nextMatch.sets.length > 0;

      if (nextMatchHasRecordedResult) {
        return {
          success: false,
          message:
            "You cannot reset this result because a downstream knockout match already has a recorded result.",
        };
      }

      const shouldClearAdvancedTeam =
        (target.nextSlot === "teamAId" && nextMatch.teamAId !== null) ||
        (target.nextSlot === "teamBId" && nextMatch.teamBId !== null);

      if (shouldClearAdvancedTeam) {
        await prisma.match.update({
          where: {
            id: nextMatch.id,
          },
          data: {
            [target.nextSlot]: null,
          },
        });
      }
    }
  }

  await prisma.$transaction([
    prisma.match.update({
      where: {
        id: match.id,
      },
      data: {
        winnerId: null,
        scoreSummary: null,
        status: "scheduled",
      },
    }),
    prisma.matchSet.deleteMany({
      where: {
        matchId: match.id,
      },
    }),
  ]);

  revalidateResultPaths(tournamentId, categoryId);

  return {
    success: true,
    message: "Match result reset successfully.",
  };
}
