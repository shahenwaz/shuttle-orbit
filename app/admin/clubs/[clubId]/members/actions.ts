"use server";

import { ClubMemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";

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

const validClubRoles = new Set<ClubMemberRole>([
  ClubMemberRole.OWNER,
  ClubMemberRole.ORGANIZER,
  ClubMemberRole.MEMBER,
]);

function revalidateClubPaths(clubId: string) {
  revalidatePath(`/admin/clubs/${clubId}`);
  revalidatePath(`/admin/clubs/${clubId}/members`);
  revalidatePath(`/admin/clubs/${clubId}/edit`);
  revalidatePath("/admin/clubs");
  revalidatePath("/clubs");
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBooleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getClubRole(value: string): ClubMemberRole | null {
  if (!value) {
    return ClubMemberRole.MEMBER;
  }

  if (validClubRoles.has(value as ClubMemberRole)) {
    return value as ClubMemberRole;
  }

  return null;
}

export async function createClubMemberAction(
  _prevState: ClubMemberActionState,
  formData: FormData,
): Promise<ClubMemberActionState> {
  const clubId = getStringValue(formData, "clubId");
  const playerId = getStringValue(formData, "playerId");
  const role = getClubRole(getStringValue(formData, "role"));
  const isPublic = getBooleanValue(formData, "isPublic");

  const fieldErrors: ClubMemberActionState["fieldErrors"] = {};

  if (!clubId) {
    return {
      success: false,
      message: "Invalid club.",
    };
  }

  if (!playerId) {
    fieldErrors.playerId = ["Choose an existing Shuttle Orbit player."];
  }

  if (!role) {
    fieldErrors.role = ["Choose a valid club role."];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors,
    };
  }

  const [club, player] = await Promise.all([
    prisma.club.findUnique({
      where: {
        id: clubId,
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

  if (!club) {
    return {
      success: false,
      message: "Club not found.",
    };
  }

  if (!player) {
    return {
      success: false,
      message: "Selected player was not found.",
      fieldErrors: {
        playerId: ["Choose a valid player."],
      },
    };
  }

  if (player.clubId === clubId) {
    return {
      success: false,
      message: "This player is already assigned to this club.",
      fieldErrors: {
        playerId: ["This player already exists in this club."],
      },
    };
  }

  if (player.clubId && player.clubId !== clubId) {
    return {
      success: false,
      message:
        "This player is already assigned to another club. Remove them from that club first.",
      fieldErrors: {
        playerId: ["Player already has a club."],
      },
    };
  }

  await prisma.player.update({
    where: {
      id: player.id,
    },
    data: {
      clubId,
      clubRole: role ?? ClubMemberRole.MEMBER,
      clubProfilePublic: isPublic,
      clubJoinedAt: new Date(),
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Player added to club successfully.",
    fieldErrors: {},
  };
}

export async function updateClubMemberAction(
  _prevState: ClubMemberActionState,
  formData: FormData,
): Promise<ClubMemberActionState> {
  const clubId = getStringValue(formData, "clubId");
  const memberId = getStringValue(formData, "memberId");
  const role = getClubRole(getStringValue(formData, "role"));
  const isPublic = getBooleanValue(formData, "isPublic");

  const fieldErrors: ClubMemberActionState["fieldErrors"] = {};

  if (!clubId || !memberId) {
    return {
      success: false,
      message: "Invalid club member.",
    };
  }

  if (!role) {
    fieldErrors.role = ["Choose a valid club role."];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors,
    };
  }

  const player = await prisma.player.findFirst({
    where: {
      id: memberId,
      clubId,
    },
    select: {
      id: true,
    },
  });

  if (!player) {
    return {
      success: false,
      message: "Club player not found.",
    };
  }

  await prisma.player.update({
    where: {
      id: player.id,
    },
    data: {
      clubRole: role ?? ClubMemberRole.MEMBER,
      clubProfilePublic: isPublic,
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Club player updated successfully.",
    fieldErrors: {},
  };
}

export async function deleteClubMemberAction(
  formData: FormData,
): Promise<DeleteClubMemberActionState> {
  const clubId = getStringValue(formData, "clubId");
  const memberId = getStringValue(formData, "memberId");

  if (!clubId || !memberId) {
    return {
      success: false,
      message: "Invalid club member.",
    };
  }

  const player = await prisma.player.findFirst({
    where: {
      id: memberId,
      clubId,
    },
    select: {
      id: true,
    },
  });

  if (!player) {
    return {
      success: false,
      message: "Club player not found.",
    };
  }

  await prisma.player.update({
    where: {
      id: player.id,
    },
    data: {
      clubId: null,
      clubRole: ClubMemberRole.MEMBER,
      clubProfilePublic: false,
      clubJoinedAt: null,
      clubNotes: null,
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Player removed from club successfully.",
  };
}
