"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";

export type ClubAttendanceActionState = {
  success: boolean;
  message: string;
};

function revalidateClubPaths(clubId: string) {
  revalidatePath(`/admin/clubs/${clubId}`);
  revalidatePath(`/admin/clubs/${clubId}?tab=sessions`);
  revalidatePath("/admin/clubs");
}

export async function setClubSessionAttendanceAction(
  formData: FormData,
): Promise<ClubAttendanceActionState> {
  const clubId = formData.get("clubId");
  const sessionId = formData.get("sessionId");
  const memberId = formData.get("memberId");
  const status = formData.get("status");

  if (
    typeof clubId !== "string" ||
    !clubId ||
    typeof sessionId !== "string" ||
    !sessionId ||
    typeof memberId !== "string" ||
    !memberId ||
    (status !== "GOING" && status !== "NOT_GOING")
  ) {
    return {
      success: false,
      message: "Invalid attendance update.",
    };
  }

  const playerId = memberId;

  const [session, player] = await Promise.all([
    prisma.clubSession.findFirst({
      where: {
        id: sessionId,
        clubId,
      },
      select: {
        id: true,
      },
    }),
    prisma.player.findFirst({
      where: {
        id: playerId,
        clubId,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!session) {
    return {
      success: false,
      message: "Session not found.",
    };
  }

  if (!player) {
    return {
      success: false,
      message: "Club player not found.",
    };
  }

  await prisma.clubSessionAttendance.upsert({
    where: {
      sessionId_playerId: {
        sessionId,
        playerId,
      },
    },
    create: {
      sessionId,
      playerId,
      status,
    },
    update: {
      status,
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Attendance updated.",
  };
}
