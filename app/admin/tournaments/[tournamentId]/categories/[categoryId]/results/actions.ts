"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { getAdvanceTarget } from "@/lib/knockout/helpers";

export type RecordMatchResultActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    teamAScore?: string[];
    teamBScore?: string[];
  };
};

const recordMatchResultSchema = z.object({
  tournamentId: z.cuid(),
  categoryId: z.cuid(),
  matchId: z.cuid(),
  teamAScore: z.coerce.number().int().min(0, "Score must be 0 or more."),
  teamBScore: z.coerce.number().int().min(0, "Score must be 0 or more."),
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

export async function recordMatchResultAction(
  _prevState: RecordMatchResultActionState,
  formData: FormData,
): Promise<RecordMatchResultActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    matchId: formData.get("matchId"),
    teamAScore: formData.get("teamAScore"),
    teamBScore: formData.get("teamBScore"),
  };

  const parsed = recordMatchResultSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, categoryId, matchId, teamAScore, teamBScore } =
    parsed.data;

  if (teamAScore === teamBScore) {
    return {
      success: false,
      message: "A match cannot end in a draw.",
      fieldErrors: {
        teamBScore: ["Enter a score that produces a winner."],
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

  const winnerId = teamAScore > teamBScore ? match.teamAId : match.teamBId;

  await prisma.$transaction([
    prisma.match.update({
      where: {
        id: matchId,
      },
      data: {
        scoreSummary: `${teamAScore} - ${teamBScore}`,
        winnerId,
        status: "completed",
      },
    }),
    prisma.matchSet.deleteMany({
      where: {
        matchId,
      },
    }),
    prisma.matchSet.create({
      data: {
        matchId,
        setNumber: 1,
        teamAScore,
        teamBScore,
      },
    }),
  ]);

  if (
    match.stage.stageType === "quarter_final" ||
    match.stage.stageType === "semi_final" ||
    match.stage.stageType === "final"
  ) {
    const matchNumber = Number(match.roundLabel?.match(/\d+/)?.[0] ?? "1");

    const target = getAdvanceTarget(
      match.stage.stageType as "quarter_final" | "semi_final" | "final",
      matchNumber,
    );

    if (target) {
      const nextStage = await prisma.stage.findFirst({
        where: {
          categoryId,
          stageType: target.nextStageType,
        },
        select: {
          id: true,
        },
      });

      if (nextStage) {
        let nextRoundLabel: string;

        if (target.nextStageType === "final") {
          nextRoundLabel = "Final";
        } else {
          nextRoundLabel = `Semi Final ${target.nextMatchNumber}`;
        }

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
              [target.nextSlot]: winnerId,
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
