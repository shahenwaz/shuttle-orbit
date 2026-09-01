"use server";

import { ClubMemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export type ClubMemberActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    playerId?: string[];
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
  await requireAdmin();

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

  const assignment = await prisma.player.updateMany({
    where: {
      id: player.id,
      clubId: null,
    },
    data: {
      clubId,
      clubRole: role ?? ClubMemberRole.MEMBER,
      clubProfilePublic: isPublic,
      clubJoinedAt: new Date(),
    },
  });

  if (assignment.count === 0) {
    return {
      success: false,
      message: "This player's club assignment changed. Refresh and try again.",
    };
  }

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
  await requireAdmin();

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

  const update = await prisma.player.updateMany({
    where: {
      id: player.id,
      clubId,
    },
    data: {
      clubRole: role ?? ClubMemberRole.MEMBER,
      clubProfilePublic: isPublic,
    },
  });

  if (update.count === 0) {
    return {
      success: false,
      message: "Club player no longer belongs to this club.",
    };
  }

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
  await requireAdmin();

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

  const removal = await prisma.player.updateMany({
    where: {
      id: player.id,
      clubId,
    },
    data: {
      clubId: null,
      clubRole: ClubMemberRole.MEMBER,
      clubProfilePublic: false,
      clubJoinedAt: null,
      clubNotes: null,
    },
  });

  if (removal.count === 0) {
    return {
      success: false,
      message: "Club player no longer belongs to this club.",
    };
  }

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Player removed from club successfully.",
  };
}
