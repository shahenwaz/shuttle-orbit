"use server";

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
        clubJoinedAt: true,
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

  const isJoiningNewClub = validClubId && currentPlayer.clubId !== validClubId;

  await prisma.player.update({
    where: { id: playerId },
    data: {
      fullName,
      nickname,
      clubId: validClubId,
      clubProfilePublic: Boolean(validClubId),
      clubJoinedAt: validClubId
        ? (currentPlayer.clubJoinedAt ?? (isJoiningNewClub ? new Date() : null))
        : null,
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

  const usageCount = await prisma.teamEntry.count({
    where: {
      OR: [{ player1Id: playerId }, { player2Id: playerId }],
    },
  });

  if (usageCount > 0) {
    return {
      success: false,
      message:
        "This player cannot be deleted because they are already used in teams or tournament history.",
    };
  }

  await prisma.player.delete({
    where: {
      id: playerId,
    },
  });

  revalidatePath("/admin/players");
  revalidatePath("/clubs");

  return {
    success: true,
    message: "Player removed successfully.",
  };
}
