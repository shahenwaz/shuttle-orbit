"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export type SimpleGroupActionState = {
  success: boolean;
  message: string;
};

const removeGroupMembershipSchema = z.object({
  tournamentId: z.cuid({ error: "Invalid tournament id." }),
  categoryId: z.cuid({ error: "Invalid category id." }),
  membershipId: z.cuid({ error: "Invalid membership id." }),
});

const resetGroupFixturesSchema = z.object({
  tournamentId: z.cuid({ error: "Invalid tournament id." }),
  categoryId: z.cuid({ error: "Invalid category id." }),
  groupId: z.cuid({ error: "Invalid group id." }),
});

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
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/results`,
  );
  revalidatePath(`/tournaments`);
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

export async function removeGroupMembershipAction(
  _prevState: SimpleGroupActionState,
  formData: FormData,
): Promise<SimpleGroupActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    membershipId: formData.get("membershipId"),
  };

  const parsed = removeGroupMembershipSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid remove request.",
    };
  }

  const { tournamentId, categoryId, membershipId } = parsed.data;

  const membership = await prisma.groupMembership.findUnique({
    where: { id: membershipId },
    select: {
      id: true,
      group: {
        select: {
          stage: {
            select: {
              categoryId: true,
            },
          },
        },
      },
    },
  });

  if (!membership || membership.group.stage.categoryId !== categoryId) {
    return {
      success: false,
      message: "Group membership not found.",
    };
  }

  await prisma.groupMembership.delete({
    where: { id: membershipId },
  });

  revalidateGroupAdminPaths(tournamentId, categoryId);

  return {
    success: true,
    message: "Team removed from group.",
  };
}

export async function resetGroupFixturesAction(
  _prevState: SimpleGroupActionState,
  formData: FormData,
): Promise<SimpleGroupActionState> {
  const rawValues = {
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    groupId: formData.get("groupId"),
  };

  const parsed = resetGroupFixturesSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid fixture reset request.",
    };
  }

  const { tournamentId, categoryId, groupId } = parsed.data;

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
      message: "Group not found.",
    };
  }

  await prisma.$transaction(async (tx) => {
    const matches = await tx.match.findMany({
      where: {
        tournamentId,
        categoryId,
        groupId,
      },
      select: {
        id: true,
      },
    });

    const matchIds = matches.map((match) => match.id);

    if (matchIds.length > 0) {
      await tx.matchSet.deleteMany({
        where: {
          matchId: {
            in: matchIds,
          },
        },
      });

      await tx.match.deleteMany({
        where: {
          id: {
            in: matchIds,
          },
        },
      });
    }
  });

  revalidateGroupAdminPaths(tournamentId, categoryId);

  return {
    success: true,
    message: "Group fixtures reset successfully.",
  };
}

// The updateGroupAction is defined here instead of in the edit-group-form file to keep all group related actions in one place, as they share some validation logic and types.

export type UpdateGroupActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    name?: string[];
    groupOrder?: string[];
  };
};

export async function updateGroupAction(
  _prevState: UpdateGroupActionState,
  formData: FormData,
): Promise<UpdateGroupActionState> {
  const tournamentId = formData.get("tournamentId");
  const categoryId = formData.get("categoryId");
  const groupId = formData.get("groupId");
  const name = formData.get("name");
  const groupOrder = formData.get("groupOrder");

  if (
    typeof tournamentId !== "string" ||
    typeof categoryId !== "string" ||
    typeof groupId !== "string" ||
    typeof name !== "string" ||
    typeof groupOrder !== "string"
  ) {
    return {
      success: false,
      message: "Invalid form submission.",
    };
  }

  const trimmedName = name.trim();
  const parsedOrder = Number(groupOrder);

  if (!trimmedName) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: {
        name: ["Group name is required."],
      },
    };
  }

  if (!Number.isInteger(parsedOrder) || parsedOrder < 1) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: {
        groupOrder: ["Group order must be a positive whole number."],
      },
    };
  }

  const existingGroup = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    select: {
      id: true,
      stageId: true,
    },
  });

  if (!existingGroup) {
    return {
      success: false,
      message: "Group not found.",
    };
  }

  const duplicateName = await prisma.group.findFirst({
    where: {
      stageId: existingGroup.stageId,
      name: trimmedName,
      NOT: {
        id: groupId,
      },
    },
    select: {
      id: true,
    },
  });

  if (duplicateName) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: {
        name: [
          "Another group with this name already exists in the same stage.",
        ],
      },
    };
  }

  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      name: trimmedName,
      groupOrder: parsedOrder,
    },
  });

  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/groups`,
  );

  return {
    success: true,
    message: "Group updated successfully.",
    fieldErrors: {},
  };
}

// The deleteGroupAction is defined here instead of in the edit-group-form file to keep all group related actions in one place, as they share some validation logic and types.

export type DeleteGroupActionState = {
  success: boolean;
  message: string;
};

export async function deleteGroupAction(
  formData: FormData,
): Promise<DeleteGroupActionState> {
  const tournamentId = formData.get("tournamentId");
  const categoryId = formData.get("categoryId");
  const groupId = formData.get("groupId");

  if (
    typeof tournamentId !== "string" ||
    typeof categoryId !== "string" ||
    typeof groupId !== "string"
  ) {
    return {
      success: false,
      message: "Invalid group deletion request.",
    };
  }

  const group = await prisma.group.findFirst({
    where: {
      id: groupId,
      stage: {
        categoryId,
        category: {
          tournamentId,
        },
      },
    },
    include: {
      memberships: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!group) {
    return {
      success: false,
      message: "Group not found.",
    };
  }

  if (group.memberships.length > 0) {
    return {
      success: false,
      message: "Unassign all teams from this group before deleting it.",
    };
  }

  await prisma.group.delete({
    where: {
      id: groupId,
    },
  });

  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/groups`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures`,
  );
  revalidatePath(
    `/admin/tournaments/${tournamentId}/categories/${categoryId}/results`,
  );

  return {
    success: true,
    message: "Group deleted successfully.",
  };
}
