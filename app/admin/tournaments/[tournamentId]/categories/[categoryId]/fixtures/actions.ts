"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { generateRoundRobinPairings } from "@/lib/tournament/fixtures";
import { generateGroupFixturesSchema } from "@/lib/validations/fixture";

export type GenerateGroupFixturesActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    tournamentId?: string[];
    categoryId?: string[];
    groupId?: string[];
  };
};

function revalidateFixturePaths(tournamentId: string, categoryId: string) {
  revalidatePath(`/admin/tournaments/${tournamentId}`);
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/groups`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`,
  );
  revalidatePath(`/tournaments`);
}

export async function generateGroupFixturesAction(
  _prevState: GenerateGroupFixturesActionState,
  formData: FormData,
): Promise<GenerateGroupFixturesActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    groupId: formData.get("groupId"),
  };

  const parsed = generateGroupFixturesSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, categoryId, groupId } = parsed.data;

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      stage: {
        select: {
          id: true,
          categoryId: true,
          stageOrder: true,
          stageType: true,
        },
      },
      memberships: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          teamEntry: {
            select: {
              id: true,
            },
          },
        },
      },
      matches: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!group || group.stage.categoryId !== categoryId) {
    return {
      success: false,
      message: "Selected group was not found for this category.",
    };
  }

  if (group.memberships.length < 2) {
    return {
      success: false,
      message: "At least 2 teams are required to generate fixtures.",
    };
  }

  if (group.matches.length > 0) {
    return {
      success: false,
      message: "Fixtures already exist for this group.",
    };
  }

  const teamEntries = group.memberships.map((membership) => ({
    id: membership.teamEntry.id,
  }));

  const pairings = generateRoundRobinPairings(teamEntries);

  if (pairings.length === 0) {
    return {
      success: false,
      message: "No valid fixtures could be generated for this group.",
    };
  }

  const existingMatches = await prisma.match.findMany({
    where: {
      tournamentId,
      categoryId,
      stageId: group.stage.id,
      groupId,
    },
    select: {
      teamAId: true,
      teamBId: true,
    },
  });

  const existingMatchKeys = new Set(
    existingMatches.map((match) =>
      [match.teamAId, match.teamBId].sort().join("::"),
    ),
  );

  const newPairings = pairings.filter((pairing) => {
    const key = [pairing.teamAId, pairing.teamBId].sort().join("::");
    return !existingMatchKeys.has(key);
  });

  if (newPairings.length === 0) {
    return {
      success: false,
      message: "All fixtures for this group already exist.",
    };
  }

  await prisma.$transaction(
    newPairings.map((pairing) =>
      prisma.match.create({
        data: {
          tournamentId,
          categoryId,
          stageId: group.stage.id,
          groupId,
          roundLabel: pairing.roundLabel,
          teamAId: pairing.teamAId,
          teamBId: pairing.teamBId,
          status: "scheduled",
        },
      }),
    ),
  );

  revalidateFixturePaths(tournamentId, categoryId);

  return {
    success: true,
    message: `${newPairings.length} fixtures generated successfully.`,
    fieldErrors: {},
  };
}
