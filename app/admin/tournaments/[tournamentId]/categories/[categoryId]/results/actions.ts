"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import {
  recordMatchResultSchema,
  type RecordMatchResultInput,
} from "@/lib/validations/result";

export type RecordMatchResultActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof RecordMatchResultInput, string[]>>;
};

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

  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      tournamentId,
      categoryId,
    },
    select: {
      id: true,
      teamAId: true,
      teamBId: true,
    },
  });

  if (!match) {
    return {
      success: false,
      message: "Match not found for this category.",
    };
  }

  const winnerId = teamAScore > teamBScore ? match.teamAId : match.teamBId;

  await prisma.$transaction(async (tx) => {
    await tx.matchSet.deleteMany({
      where: {
        matchId,
      },
    });

    await tx.matchSet.create({
      data: {
        matchId,
        setNumber: 1,
        teamAScore,
        teamBScore,
      },
    });

    await tx.match.update({
      where: {
        id: matchId,
      },
      data: {
        status: "completed",
        winnerId,
        scoreSummary: `${teamAScore}-${teamBScore}`,
      },
    });
  });

  revalidateResultPaths(tournamentId, categoryId);

  return {
    success: true,
    message: "Match result saved successfully.",
    fieldErrors: {},
  };
}
