"use server";

import { ClubMemberRole, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { createPlayerSchema } from "@/lib/validations/player";

export type CreatePlayerActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    fullName?: string[];
    nickname?: string[];
    clubId?: string[];
  };
};

export type UpdatePlayerActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    fullName?: string[];
    nickname?: string[];
    clubId?: string[];
  };
};

export type DeletePlayerActionState = {
  success: boolean;
  message: string;
};

async function getValidClubId(clubId: string | null) {
  if (!clubId) {
    return null;
  }

  const club = await prisma.club.findUnique({
    where: {
      id: clubId,
    },
    select: {
      id: true,
    },
  });

  return club?.id ?? null;
}

export async function createPlayerAction(
  _prevState: CreatePlayerActionState,
  formData: FormData,
): Promise<CreatePlayerActionState> {
  await requireAdmin();

  const rawValues = {
    fullName: formData.get("fullName"),
    nickname: formData.get("nickname"),
    clubId: formData.get("clubId"),
  };

  const parsed = createPlayerSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { fullName, nickname, clubId } = parsed.data;

  const existingPlayer = await prisma.player.findUnique({
    where: { nickname },
    select: { id: true },
  });

  if (existingPlayer) {
    return {
      success: false,
      message: "This username is already taken.",
      fieldErrors: {
        nickname: ["Choose a different username."],
      },
    };
  }

  const validClubId = await getValidClubId(clubId);

  if (clubId && !validClubId) {
    return {
      success: false,
      message: "Selected club was not found.",
      fieldErrors: {
        clubId: ["Choose a valid club."],
      },
    };
  }

  await prisma.player.create({
    data: {
      fullName,
      nickname,
      clubId: validClubId,
      clubProfilePublic: Boolean(validClubId),
      clubJoinedAt: validClubId ? new Date() : null,
    },
  });

  revalidatePath("/admin/players");
  revalidatePath("/clubs");

  return {
    success: true,
    message: "Player created successfully.",
    fieldErrors: {},
  };
}

export async function updatePlayerAction(
  _prevState: UpdatePlayerActionState,
  formData: FormData,
): Promise<UpdatePlayerActionState> {
  await requireAdmin();

  const playerId = formData.get("playerId");

  if (typeof playerId !== "string" || !playerId) {
    return {
      success: false,
      message: "Invalid player.",
    };
  }

  const rawValues = {
    fullName: formData.get("fullName"),
    nickname: formData.get("nickname"),
    clubId: formData.get("clubId"),
  };

  const parsed = createPlayerSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { fullName, nickname, clubId } = parsed.data;

  const [existingPlayer, currentPlayer] = await Promise.all([
    prisma.player.findFirst({
      where: {
        nickname,
        NOT: {
          id: playerId,
        },
      },
      select: {
        id: true,
      },
    }),
    prisma.player.findUnique({
      where: {
        id: playerId,
      },
      select: {
        id: true,
        clubId: true,
      },
    }),
  ]);

  if (!currentPlayer) {
    return {
      success: false,
      message: "Player was not found.",
    };
  }

  if (existingPlayer) {
    return {
      success: false,
      message: "This username is already taken.",
      fieldErrors: {
        nickname: ["Choose a different username."],
      },
    };
  }

  const validClubId = await getValidClubId(clubId);

  if (clubId && !validClubId) {
    return {
      success: false,
      message: "Selected club was not found.",
      fieldErrors: {
        clubId: ["Choose a valid club."],
      },
    };
  }

  const isChangingClub = currentPlayer.clubId !== validClubId;
  const clubMembershipUpdate = !isChangingClub
    ? {}
    : validClubId
      ? {
          clubRole: ClubMemberRole.MEMBER,
          clubProfilePublic: true,
          clubJoinedAt: new Date(),
          clubNotes: null,
        }
      : {
          clubRole: ClubMemberRole.MEMBER,
          clubProfilePublic: false,
          clubJoinedAt: null,
          clubNotes: null,
        };

  await prisma.player.update({
    where: { id: playerId },
    data: {
      fullName,
      nickname,
      clubId: validClubId,
      ...clubMembershipUpdate,
    },
  });

  revalidatePath("/admin/players");
  revalidatePath("/clubs");

  return {
    success: true,
    message: "Player updated successfully.",
    fieldErrors: {},
  };
}

export async function deletePlayerAction(
  formData: FormData,
): Promise<DeletePlayerActionState> {
  await requireAdmin();

  const playerId = formData.get("playerId");

  if (typeof playerId !== "string" || !playerId) {
    return {
      success: false,
      message: "Invalid player.",
    };
  }

  const [teamEntryUsageCount, leagueTeamUsageCount, leagueStatUsageCount] =
    await Promise.all([
      prisma.teamEntry.count({
        where: {
          OR: [{ player1Id: playerId }, { player2Id: playerId }],
        },
      }),
      prisma.leagueTeamPlayer.count({
        where: {
          playerId,
        },
      }),
      prisma.playerLeagueStat.count({
        where: {
          playerId,
        },
      }),
    ]);

  if (teamEntryUsageCount > 0) {
    return {
      success: false,
      message:
        "This player cannot be deleted because they are already used in teams or tournament history.",
    };
  }

  if (leagueTeamUsageCount > 0 || leagueStatUsageCount > 0) {
    return {
      success: false,
      message:
        "This player cannot be deleted because they are already used in league teams or league history.",
    };
  }

  try {
    await prisma.player.delete({
      where: {
        id: playerId,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        success: false,
        message: "Player was not found.",
      };
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        success: false,
        message:
          "This player cannot be deleted because they are still used by tournament or league records.",
      };
    }

    throw error;
  }

  revalidatePath("/admin/players");
  revalidatePath("/clubs");

  return {
    success: true,
    message: "Player removed successfully.",
  };
}
