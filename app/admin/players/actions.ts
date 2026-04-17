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
    gender?: string[];
    communityTag?: string[];
  };
};

export async function createPlayerAction(
  _prevState: CreatePlayerActionState,
  formData: FormData,
): Promise<CreatePlayerActionState> {
  const rawValues = {
    fullName: formData.get("fullName"),
    nickname: formData.get("nickname"),
    gender: formData.get("gender"),
    communityTag: formData.get("communityTag"),
  };

  const parsed = createPlayerSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { fullName, nickname, gender, communityTag } = parsed.data;

  await prisma.player.create({
    data: {
      fullName,
      nickname: nickname || null,
      gender: gender || null,
      communityTag: communityTag || null,
    },
  });

  revalidatePath("/admin/players");

  return {
    success: true,
    message: "Player created successfully.",
    fieldErrors: {},
  };
}
