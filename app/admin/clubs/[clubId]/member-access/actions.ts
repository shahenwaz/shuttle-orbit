"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";

export type ClubMemberAccessActionState = {
  success: boolean;
  message: string;
};

function createShareKey() {
  return randomBytes(18).toString("base64url");
}

function revalidateClubPaths(clubId: string) {
  revalidatePath(`/admin/clubs/${clubId}`);
  revalidatePath("/admin/clubs");
}

export async function enableClubMemberAccessAction(
  formData: FormData,
): Promise<ClubMemberAccessActionState> {
  const clubId = formData.get("clubId");

  if (typeof clubId !== "string" || !clubId) {
    return {
      success: false,
      message: "Invalid club.",
    };
  }

  const club = await prisma.club.findUnique({
    where: {
      id: clubId,
    },
    select: {
      id: true,
      isManagedClub: true,
      memberShareKey: true,
    },
  });

  if (!club) {
    return {
      success: false,
      message: "Club not found.",
    };
  }

  if (!club.isManagedClub) {
    return {
      success: false,
      message: "Private member view is only available for managed clubs.",
    };
  }

  await prisma.club.update({
    where: {
      id: clubId,
    },
    data: {
      memberAccessEnabled: true,
      memberShareKey: club.memberShareKey ?? createShareKey(),
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Private member view enabled.",
  };
}

export async function refreshClubMemberShareKeyAction(
  formData: FormData,
): Promise<ClubMemberAccessActionState> {
  const clubId = formData.get("clubId");

  if (typeof clubId !== "string" || !clubId) {
    return {
      success: false,
      message: "Invalid club.",
    };
  }

  const club = await prisma.club.findUnique({
    where: {
      id: clubId,
    },
    select: {
      id: true,
      isManagedClub: true,
    },
  });

  if (!club) {
    return {
      success: false,
      message: "Club not found.",
    };
  }

  if (!club.isManagedClub) {
    return {
      success: false,
      message: "Private member view is only available for managed clubs.",
    };
  }

  await prisma.club.update({
    where: {
      id: clubId,
    },
    data: {
      memberAccessEnabled: true,
      memberShareKey: createShareKey(),
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Private member link refreshed.",
  };
}

export async function disableClubMemberAccessAction(
  formData: FormData,
): Promise<ClubMemberAccessActionState> {
  const clubId = formData.get("clubId");

  if (typeof clubId !== "string" || !clubId) {
    return {
      success: false,
      message: "Invalid club.",
    };
  }

  await prisma.club.update({
    where: {
      id: clubId,
    },
    data: {
      memberAccessEnabled: false,
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Private member view disabled.",
  };
}
