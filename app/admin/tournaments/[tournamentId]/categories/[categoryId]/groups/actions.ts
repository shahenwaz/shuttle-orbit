"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import {
  assignTeamToGroupSchema,
  createGroupSchema,
  type AssignTeamToGroupInput,
  type CreateGroupInput,
} from "@/lib/validations/group";

export type CreateGroupActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof CreateGroupInput, string[]>>;
};

export type AssignTeamToGroupActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof AssignTeamToGroupInput, string[]>>;
};

async function getOrCreateDefaultGroupStage(categoryId: string) {
  const existingStage = await prisma.stage.findFirst({
    where: {
      categoryId,
      stageOrder: 1,
    },
    select: {
      id: true,
    },
  });

  if (existingStage) {
    return existingStage;
  }

  return prisma.stage.create({
    data: {
      categoryId,
      name: "Group Stage",
      stageType: "round_robin",
      stageOrder: 1,
      configJson: {
        generatedByAdmin: true,
      },
    },
    select: {
      id: true,
    },
  });
}

function revalidateGroupAdminPaths(tournamentId: string, categoryId: string) {
  revalidatePath(`/admin/tournaments/${tournamentId}`);
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/teams`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/groups`,
  );
}

export async function createGroupAction(
  _prevState: CreateGroupActionState,
  formData: FormData,
): Promise<CreateGroupActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    groupOrder: formData.get("groupOrder"),
  };

  const parsed = createGroupSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, categoryId, name, groupOrder } = parsed.data;

  const category = await prisma.tournamentCategory.findFirst({
    where: {
      id: categoryId,
      tournamentId,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Category not found.",
    };
  }

  const stage = await getOrCreateDefaultGroupStage(categoryId);

  const normalizedGroupName = name.trim().toUpperCase();

  const existingGroupByName = await prisma.group.findFirst({
    where: {
      stageId: stage.id,
      name: normalizedGroupName,
    },
    select: {
      id: true,
    },
  });

  if (existingGroupByName) {
    return {
      success: false,
      message: "A group with this name already exists.",
      fieldErrors: {
        name: ["Use a different group name."],
      },
    };
  }

  const existingGroupByOrder = await prisma.group.findFirst({
    where: {
      stageId: stage.id,
      groupOrder,
    },
    select: {
      id: true,
    },
  });

  if (existingGroupByOrder) {
    return {
      success: false,
      message: "This group order is already used.",
      fieldErrors: {
        groupOrder: ["Choose a different group order."],
      },
    };
  }

  await prisma.group.create({
    data: {
      stageId: stage.id,
      name: normalizedGroupName,
      groupOrder,
    },
  });

  revalidateGroupAdminPaths(tournamentId, categoryId);

  return {
    success: true,
    message: "Group created successfully.",
    fieldErrors: {},
  };
}

export async function assignTeamToGroupAction(
  _prevState: AssignTeamToGroupActionState,
  formData: FormData,
): Promise<AssignTeamToGroupActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    groupId: formData.get("groupId"),
    teamEntryId: formData.get("teamEntryId"),
  };

  const parsed = assignTeamToGroupSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, categoryId, groupId, teamEntryId } = parsed.data;

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      stage: {
        select: {
          id: true,
          categoryId: true,
        },
      },
    },
  });

  if (!group || group.stage.categoryId !== categoryId) {
    return {
      success: false,
      message: "Selected group was not found for this category.",
    };
  }

  const team = await prisma.teamEntry.findFirst({
    where: {
      id: teamEntryId,
      tournamentId,
      categoryId,
    },
    select: {
      id: true,
    },
  });

  if (!team) {
    return {
      success: false,
      message: "Selected team was not found in this category.",
    };
  }

  const existingMembershipInStage = await prisma.groupMembership.findFirst({
    where: {
      teamEntryId,
      group: {
        stageId: group.stage.id,
      },
    },
    select: {
      id: true,
      groupId: true,
    },
  });

  if (existingMembershipInStage) {
    if (existingMembershipInStage.groupId === groupId) {
      return {
        success: false,
        message: "This team is already assigned to the selected group.",
      };
    }

    await prisma.groupMembership.update({
      where: {
        id: existingMembershipInStage.id,
      },
      data: {
        groupId,
      },
    });
  } else {
    await prisma.groupMembership.create({
      data: {
        groupId,
        teamEntryId,
      },
    });
  }

  revalidateGroupAdminPaths(tournamentId, categoryId);

  return {
    success: true,
    message: "Team assigned successfully.",
    fieldErrors: {},
  };
}
