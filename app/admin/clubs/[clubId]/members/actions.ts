"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { clubMemberFormSchema } from "@/lib/validations/club-member";

export type ClubMemberActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    playerId?: string[];
    name?: string[];
    nickname?: string[];
    role?: string[];
    isPublic?: string[];
  };
};

export type DeleteClubMemberActionState = {
  success: boolean;
  message: string;
};

function revalidateClubPaths(clubId: string) {
  revalidatePath(`/admin/clubs/${clubId}`);
  revalidatePath(`/admin/clubs/${clubId}/members`);
  revalidatePath(`/admin/clubs/${clubId}/edit`);
  revalidatePath("/admin/clubs");
}

export async function createClubMemberAction(
  _prevState: ClubMemberActionState,
  formData: FormData,
): Promise<ClubMemberActionState> {
  const clubId = formData.get("clubId");

  if (typeof clubId !== "string" || !clubId) {
    return {
      success: false,
      message: "Invalid club.",
    };
  }

  const parsed = clubMemberFormSchema.safeParse({
    playerId: formData.get("playerId"),
    name: formData.get("name"),
    nickname: formData.get("nickname"),
    role: formData.get("role") || "MEMBER",
    isPublic: formData.get("isPublic"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const club = await prisma.club.findUnique({
    where: {
      id: clubId,
    },
    select: {
      id: true,
    },
  });

  if (!club) {
    return {
      success: false,
      message: "Club not found.",
    };
  }

  const linkedPlayer = parsed.data.playerId
    ? await prisma.player.findUnique({
        where: {
          id: parsed.data.playerId,
        },
        select: {
          id: true,
          fullName: true,
          nickname: true,
        },
      })
    : null;

  if (parsed.data.playerId && !linkedPlayer) {
    return {
      success: false,
      message: "Selected player was not found.",
      fieldErrors: {
        playerId: ["Choose a valid player."],
      },
    };
  }

  if (linkedPlayer) {
    const existingLinkedMember = await prisma.clubMember.findFirst({
      where: {
        clubId,
        playerId: linkedPlayer.id,
      },
      select: {
        id: true,
      },
    });

    if (existingLinkedMember) {
      return {
        success: false,
        message: "This player is already linked to this club.",
        fieldErrors: {
          playerId: ["This player already exists in this club."],
        },
      };
    }
  }

  await prisma.clubMember.create({
    data: {
      clubId,
      playerId: linkedPlayer?.id,
      name: linkedPlayer?.fullName ?? parsed.data.name ?? "Club member",
      nickname: linkedPlayer?.nickname ?? parsed.data.nickname,
      role: parsed.data.role,
      isPublic: parsed.data.isPublic,
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Club member added successfully.",
    fieldErrors: {},
  };
}

export async function updateClubMemberAction(
  _prevState: ClubMemberActionState,
  formData: FormData,
): Promise<ClubMemberActionState> {
  const clubId = formData.get("clubId");
  const memberId = formData.get("memberId");

  if (
    typeof clubId !== "string" ||
    !clubId ||
    typeof memberId !== "string" ||
    !memberId
  ) {
    return {
      success: false,
      message: "Invalid club member.",
    };
  }

  const parsed = clubMemberFormSchema.safeParse({
    playerId: formData.get("playerId"),
    name: formData.get("name"),
    nickname: formData.get("nickname"),
    role: formData.get("role") || "MEMBER",
    isPublic: formData.get("isPublic"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const member = await prisma.clubMember.findFirst({
    where: {
      id: memberId,
      clubId,
    },
    select: {
      id: true,
    },
  });

  if (!member) {
    return {
      success: false,
      message: "Club member not found.",
    };
  }

  const linkedPlayer = parsed.data.playerId
    ? await prisma.player.findUnique({
        where: {
          id: parsed.data.playerId,
        },
        select: {
          id: true,
          fullName: true,
          nickname: true,
        },
      })
    : null;

  if (parsed.data.playerId && !linkedPlayer) {
    return {
      success: false,
      message: "Selected player was not found.",
      fieldErrors: {
        playerId: ["Choose a valid player."],
      },
    };
  }

  if (linkedPlayer) {
    const existingLinkedMember = await prisma.clubMember.findFirst({
      where: {
        clubId,
        playerId: linkedPlayer.id,
        NOT: {
          id: memberId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingLinkedMember) {
      return {
        success: false,
        message: "This player is already linked to this club.",
        fieldErrors: {
          playerId: ["This player already exists in this club."],
        },
      };
    }
  }

  await prisma.clubMember.update({
    where: {
      id: memberId,
    },
    data: {
      playerId: linkedPlayer?.id,
      name: linkedPlayer?.fullName ?? parsed.data.name ?? "Club member",
      nickname: linkedPlayer?.nickname ?? parsed.data.nickname,
      role: parsed.data.role,
      isPublic: parsed.data.isPublic,
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Club member updated successfully.",
    fieldErrors: {},
  };
}

export async function deleteClubMemberAction(
  formData: FormData,
): Promise<DeleteClubMemberActionState> {
  const clubId = formData.get("clubId");
  const memberId = formData.get("memberId");

  if (
    typeof clubId !== "string" ||
    !clubId ||
    typeof memberId !== "string" ||
    !memberId
  ) {
    return {
      success: false,
      message: "Invalid club member.",
    };
  }

  const attendanceCount = await prisma.clubSessionAttendance.count({
    where: {
      memberId,
    },
  });

  if (attendanceCount > 0) {
    return {
      success: false,
      message:
        "This member cannot be removed because they already have session attendance history.",
    };
  }

  await prisma.clubMember.delete({
    where: {
      id: memberId,
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Club member removed successfully.",
  };
}
