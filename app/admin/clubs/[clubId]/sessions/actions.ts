"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { clubSessionFormSchema } from "@/lib/validations/club-session";

export type ClubSessionActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    title?: string[];
    sessionDate?: string[];
    startTime?: string[];
    endTime?: string[];
    courtNumbers?: string[];
    privateNotes?: string[];
  };
};

export type DeleteClubSessionActionState = {
  success: boolean;
  message: string;
};

function parseFloatingDateTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
}

function revalidateClubPaths(clubId: string) {
  revalidatePath(`/admin/clubs/${clubId}`);
  revalidatePath("/admin/clubs");
}

export async function createClubSessionAction(
  _prevState: ClubSessionActionState,
  formData: FormData,
): Promise<ClubSessionActionState> {
  await requireAdmin();

  const clubId = formData.get("clubId");

  if (typeof clubId !== "string" || !clubId) {
    return {
      success: false,
      message: "Invalid club.",
    };
  }

  const parsed = clubSessionFormSchema.safeParse({
    title: formData.get("title"),
    sessionDate: formData.get("sessionDate"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    courtNumbers: formData.get("courtNumbers"),
    privateNotes: formData.get("privateNotes"),
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
      message: "Sessions are only enabled for managed clubs.",
    };
  }

  await prisma.clubSession.create({
    data: {
      clubId,
      title: parsed.data.title,
      startAt: parseFloatingDateTime(
        parsed.data.sessionDate,
        parsed.data.startTime,
      ),
      endAt: parseFloatingDateTime(
        parsed.data.sessionDate,
        parsed.data.endTime,
      ),
      courtNumbers: parsed.data.courtNumbers,
      privateNotes: parsed.data.privateNotes,
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Session added successfully.",
    fieldErrors: {},
  };
}

export async function updateClubSessionAction(
  _prevState: ClubSessionActionState,
  formData: FormData,
): Promise<ClubSessionActionState> {
  await requireAdmin();

  const clubId = formData.get("clubId");
  const sessionId = formData.get("sessionId");

  if (
    typeof clubId !== "string" ||
    !clubId ||
    typeof sessionId !== "string" ||
    !sessionId
  ) {
    return {
      success: false,
      message: "Invalid session.",
    };
  }

  const parsed = clubSessionFormSchema.safeParse({
    title: formData.get("title"),
    sessionDate: formData.get("sessionDate"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    courtNumbers: formData.get("courtNumbers"),
    privateNotes: formData.get("privateNotes"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const session = await prisma.clubSession.findFirst({
    where: {
      id: sessionId,
      clubId,
    },
    select: {
      id: true,
    },
  });

  if (!session) {
    return {
      success: false,
      message: "Session not found.",
    };
  }

  await prisma.clubSession.update({
    where: {
      id: sessionId,
    },
    data: {
      title: parsed.data.title,
      startAt: parseFloatingDateTime(
        parsed.data.sessionDate,
        parsed.data.startTime,
      ),
      endAt: parseFloatingDateTime(
        parsed.data.sessionDate,
        parsed.data.endTime,
      ),
      courtNumbers: parsed.data.courtNumbers,
      privateNotes: parsed.data.privateNotes,
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Session updated successfully.",
    fieldErrors: {},
  };
}

export async function deleteClubSessionAction(
  formData: FormData,
): Promise<DeleteClubSessionActionState> {
  await requireAdmin();

  const clubId = formData.get("clubId");
  const sessionId = formData.get("sessionId");

  if (
    typeof clubId !== "string" ||
    !clubId ||
    typeof sessionId !== "string" ||
    !sessionId
  ) {
    return {
      success: false,
      message: "Invalid session.",
    };
  }

  const attendanceCount = await prisma.clubSessionAttendance.count({
    where: {
      sessionId,
    },
  });

  if (attendanceCount > 0) {
    return {
      success: false,
      message:
        "This session cannot be removed because it already has attendance records.",
    };
  }

  await prisma.clubSession.delete({
    where: {
      id: sessionId,
    },
  });

  revalidateClubPaths(clubId);

  return {
    success: true,
    message: "Session removed successfully.",
  };
}
