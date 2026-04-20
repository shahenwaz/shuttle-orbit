"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { createPlayerSchema } from "@/lib/validations/player";

export type CreatePlayerActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    fullName?: string[];
    nickname?: string[];
  };
};

export async function createPlayerAction(
  _prevState: CreatePlayerActionState,
  formData: FormData,
): Promise<CreatePlayerActionState> {
  const rawValues = {
    fullName: formData.get("fullName"),
    nickname: formData.get("nickname"),
  };

  const parsed = createPlayerSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { fullName, nickname } = parsed.data;

  const existingPlayer = await prisma.player.findUnique({
    where: {
      nickname,
    },
    select: {
      id: true,
    },
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

  await prisma.player.create({
    data: {
      fullName,
      nickname,
    },
  });

  revalidatePath("/admin/players");

  return {
    success: true,
    message: "Player created successfully.",
    fieldErrors: {},
  };
}

export type UpdatePlayerActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    fullName?: string[];
    nickname?: string[];
  };
};

export async function updatePlayerAction(
  _prevState: UpdatePlayerActionState,
  formData: FormData,
): Promise<UpdatePlayerActionState> {
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
  };

  const parsed = createPlayerSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { fullName, nickname } = parsed.data;

  const existingPlayer = await prisma.player.findFirst({
    where: {
      nickname,
      NOT: {
        id: playerId,
      },
    },
    select: {
      id: true,
    },
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

  await prisma.player.update({
    where: {
      id: playerId,
    },
    data: {
      fullName,
      nickname,
    },
  });

  revalidatePath("/admin/players");

  return {
    success: true,
    message: "Player updated successfully.",
    fieldErrors: {},
  };
}

export async function deletePlayerAction(formData: FormData) {
  const playerId = formData.get("playerId");

  if (typeof playerId !== "string" || !playerId) {
    return;
  }

  await prisma.player.delete({
    where: {
      id: playerId,
    },
  });

  revalidatePath("/admin/players");
}
