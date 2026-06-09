"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { clubFormSchema } from "@/lib/validations/club";

export type ClubActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    name?: string[];
    slug?: string[];
    shortName?: string[];
    description?: string[];
    homeVenue?: string[];
    logoUrl?: string[];
    bannerUrl?: string[];
    isPublic?: string[];
  };
};

export async function createClubAction(
  _prevState: ClubActionState,
  formData: FormData,
): Promise<ClubActionState> {
  const parsed = clubFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortName: formData.get("shortName"),
    description: formData.get("description"),
    homeVenue: formData.get("homeVenue"),
    logoUrl: formData.get("logoUrl"),
    bannerUrl: formData.get("bannerUrl"),
    isPublic: formData.get("isPublic"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existingClub = await prisma.club.findUnique({
    where: {
      slug: parsed.data.slug,
    },
    select: {
      id: true,
    },
  });

  if (existingClub) {
    return {
      success: false,
      message: "This club slug is already taken.",
      fieldErrors: {
        slug: ["Choose a different club slug."],
      },
    };
  }

  const club = await prisma.club.create({
    data: parsed.data,
    select: {
      id: true,
    },
  });

  revalidatePath("/admin/clubs");

  redirect(`/admin/clubs/${club.id}`);
}

export async function updateClubAction(
  _prevState: ClubActionState,
  formData: FormData,
): Promise<ClubActionState> {
  const clubId = formData.get("clubId");

  if (typeof clubId !== "string" || !clubId) {
    return {
      success: false,
      message: "Invalid club.",
    };
  }

  const parsed = clubFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortName: formData.get("shortName"),
    description: formData.get("description"),
    homeVenue: formData.get("homeVenue"),
    logoUrl: formData.get("logoUrl"),
    bannerUrl: formData.get("bannerUrl"),
    isPublic: formData.get("isPublic"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existingClub = await prisma.club.findFirst({
    where: {
      slug: parsed.data.slug,
      NOT: {
        id: clubId,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingClub) {
    return {
      success: false,
      message: "This club slug is already taken.",
      fieldErrors: {
        slug: ["Choose a different club slug."],
      },
    };
  }

  await prisma.club.update({
    where: {
      id: clubId,
    },
    data: parsed.data,
  });

  revalidatePath("/admin/clubs");
  revalidatePath(`/admin/clubs/${clubId}`);

  return {
    success: true,
    message: "Club updated successfully.",
    fieldErrors: {},
  };
}
