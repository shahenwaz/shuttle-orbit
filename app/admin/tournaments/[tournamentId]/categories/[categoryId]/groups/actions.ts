"use server";

import type { Prisma } from "@prisma/client";
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

const shuffleFirstStageTeamsSchema = z.object({
  tournamentId: z.cuid({ error: "Invalid tournament id." }),
  categoryId: z.cuid({ error: "Invalid category id." }),
});

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

function shuffleArray<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function getSmallestGroupIndex(groups: Array<{ currentCount: number }>) {
  let smallestIndex = 0;

  for (let index = 1; index < groups.length; index += 1) {
    const currentGroup = groups[index];
    const smallestGroup = groups[smallestIndex];

    if (!currentGroup || !smallestGroup) {
      continue;
    }

    if (currentGroup.currentCount < smallestGroup.currentCount) {
      smallestIndex = index;
    }
  }

  return smallestIndex;
}

export async function createGroupAction(
  _prevState: CreateGroupActionState,
  formData: FormData,
): Promise<CreateGroupActionState> {
  const parsed = createGroupSchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    stageId: formData.get("stageId"),
    name: formData.get("name"),
    groupOrder: formData.get("groupOrder"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, categoryId, stageId, name, groupOrder } = parsed.data;

  const stage = await prisma.stage.findFirst({
    where: {
      id: stageId,
      categoryId,
      category: {
        tournamentId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!stage) {
    return {
      success: false,
      message: "Stage not found for this category.",
    };
  }

  const duplicateGroup = await prisma.group.findFirst({
    where: {
      stageId,
      OR: [{ name }, { groupOrder }],
    },
    select: {
      id: true,
    },
  });

  if (duplicateGroup) {
    return {
      success: false,
      message: "This group name or order already exists in the selected stage.",
    };
  }

  await prisma.group.create({
    data: {
      stageId,
      name,
      groupOrder,
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
    message: "Group created successfully.",
    fieldErrors: {},
  };
}

export async function shuffleFirstGroupStageTeamsAction(
  formData: FormData,
): Promise<SimpleGroupActionState> {
  const parsed = shuffleFirstStageTeamsSchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid shuffle request.",
    };
  }

  const { tournamentId, categoryId } = parsed.data;

  const category = await prisma.tournamentCategory.findFirst({
    where: {
      id: categoryId,
      tournamentId,
    },
    select: {
      id: true,
      teamEntries: {
        select: {
          id: true,
        },
      },
      stages: {
        orderBy: {
          stageOrder: "asc",
        },
        select: {
          id: true,
          stageOrder: true,
          groups: {
            orderBy: {
              groupOrder: "asc",
            },
            select: {
              id: true,
              memberships: {
                select: {
                  teamEntryId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Category not found.",
    };
  }

  type ShuffleStage = (typeof category.stages)[number];

  const firstGroupStage = category.stages.find(
    (stage: ShuffleStage) => stage.groups.length > 0,
  );

  if (!firstGroupStage) {
    return {
      success: false,
      message: "Create first-stage groups before shuffling teams.",
    };
  }

  type FirstGroupStage = NonNullable<typeof firstGroupStage>;
  type FirstStageGroup = FirstGroupStage["groups"][number];
  type FirstStageMembership = FirstStageGroup["memberships"][number];
  type ShuffleTeamEntry = (typeof category.teamEntries)[number];

  const assignedTeamIds = new Set<string>(
    firstGroupStage.groups.flatMap((group: FirstStageGroup) =>
      group.memberships.map(
        (membership: FirstStageMembership) => membership.teamEntryId,
      ),
    ),
  );

  const unassignedTeams = category.teamEntries.filter(
    (team: ShuffleTeamEntry) => !assignedTeamIds.has(team.id),
  );

  if (unassignedTeams.length === 0) {
    return {
      success: false,
      message: "All teams are already assigned in the first group stage.",
    };
  }

  const groupBuckets = firstGroupStage.groups.map((group: FirstStageGroup) => ({
    groupId: group.id,
    currentCount: group.memberships.length,
  }));

  if (groupBuckets.length === 0) {
    return {
      success: false,
      message: "Create groups before shuffling teams.",
    };
  }

  const shuffledTeams: ShuffleTeamEntry[] =
    shuffleArray<ShuffleTeamEntry>(unassignedTeams);

  const membershipsToCreate: Array<{
    groupId: string;
    teamEntryId: string;
  }> = [];

  for (const team of shuffledTeams) {
    const targetGroupIndex = getSmallestGroupIndex(groupBuckets);
    const targetGroup = groupBuckets[targetGroupIndex];

    if (!targetGroup) {
      continue;
    }

    membershipsToCreate.push({
      groupId: targetGroup.groupId,
      teamEntryId: team.id,
    });

    targetGroup.currentCount += 1;
  }

  await prisma.groupMembership.createMany({
    data: membershipsToCreate,
    skipDuplicates: true,
  });

  revalidateGroupAdminPaths(tournamentId, categoryId);

  return {
    success: true,
    message: `${membershipsToCreate.length} team${
      membershipsToCreate.length === 1 ? "" : "s"
    } shuffled into the first group stage.`,
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

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

    type GroupMatchRow = (typeof matches)[number];

    const matchIds = matches.map((match: GroupMatchRow) => match.id);

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

export type CreateCategoryGroupStageActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    stageName?: string[];
  };
};

const createCategoryGroupStageSchema = z.object({
  tournamentId: z.cuid(),
  categoryId: z.cuid(),
  stageName: z
    .string()
    .trim()
    .min(2, "Stage name is required.")
    .max(80, "Stage name is too long."),
});

export async function createCategoryGroupStageAction(
  _prevState: CreateCategoryGroupStageActionState,
  formData: FormData,
): Promise<CreateCategoryGroupStageActionState> {
  const parsed = createCategoryGroupStageSchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    stageName: formData.get("stageName"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, categoryId, stageName } = parsed.data;

  const category = await prisma.tournamentCategory.findFirst({
    where: {
      id: categoryId,
      tournamentId,
    },
    include: {
      stages: {
        orderBy: {
          stageOrder: "asc",
        },
        select: {
          id: true,
          name: true,
          stageType: true,
          stageOrder: true,
        },
      },
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Category not found.",
    };
  }

  type ExistingStageRow = (typeof category.stages)[number];

  const duplicateStage = category.stages.find(
    (stage: ExistingStageRow) =>
      stage.name.trim().toLowerCase() === stageName.trim().toLowerCase(),
  );

  if (duplicateStage) {
    return {
      success: false,
      message: "A stage with this name already exists.",
      fieldErrors: {
        stageName: ["Choose a different stage name."],
      },
    };
  }

  const nextStageOrder =
    category.stages.reduce(
      (max: number, stage: ExistingStageRow) => Math.max(max, stage.stageOrder),
      0,
    ) + 1;

  await prisma.stage.create({
    data: {
      categoryId,
      name: stageName,
      stageType: "group_stage",
      stageOrder: nextStageOrder,
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
    message: "Stage created successfully.",
    fieldErrors: {},
  };
}

export type UpdateCategoryStageActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    stageName?: string[];
  };
};

const updateCategoryStageSchema = z.object({
  tournamentId: z.cuid(),
  categoryId: z.cuid(),
  stageId: z.cuid(),
  stageName: z
    .string()
    .trim()
    .min(2, "Stage name is required.")
    .max(80, "Stage name is too long."),
});

export async function updateCategoryStageAction(
  _prevState: UpdateCategoryStageActionState,
  formData: FormData,
): Promise<UpdateCategoryStageActionState> {
  const parsed = updateCategoryStageSchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    stageId: formData.get("stageId"),
    stageName: formData.get("stageName"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { tournamentId, categoryId, stageId, stageName } = parsed.data;

  const stage = await prisma.stage.findFirst({
    where: {
      id: stageId,
      categoryId,
      category: {
        tournamentId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!stage) {
    return {
      success: false,
      message: "Stage not found.",
    };
  }

  const duplicateStage = await prisma.stage.findFirst({
    where: {
      categoryId,
      id: {
        not: stageId,
      },
      name: {
        equals: stageName,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });

  if (duplicateStage) {
    return {
      success: false,
      message: "A stage with this name already exists.",
      fieldErrors: {
        stageName: ["Choose a different stage name."],
      },
    };
  }

  await prisma.stage.update({
    where: {
      id: stageId,
    },
    data: {
      name: stageName,
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
    message: "Stage updated successfully.",
    fieldErrors: {},
  };
}

export type DeleteCategoryStageActionState = {
  success: boolean;
  message: string;
};

const deleteCategoryStageSchema = z.object({
  tournamentId: z.cuid(),
  categoryId: z.cuid(),
  stageId: z.cuid(),
});

export async function deleteCategoryStageAction(
  formData: FormData,
): Promise<DeleteCategoryStageActionState> {
  const parsed = deleteCategoryStageSchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    categoryId: formData.get("categoryId"),
    stageId: formData.get("stageId"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid stage deletion request.",
    };
  }

  const { tournamentId, categoryId, stageId } = parsed.data;

  const stage = await prisma.stage.findFirst({
    where: {
      id: stageId,
      categoryId,
      category: {
        tournamentId,
      },
    },
    include: {
      groups: {
        select: {
          id: true,
        },
      },
      matches: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!stage) {
    return {
      success: false,
      message: "Stage not found.",
    };
  }

  if (stage.groups.length > 0 || stage.matches.length > 0) {
    return {
      success: false,
      message:
        "This stage cannot be deleted yet. Remove its groups and matches first.",
    };
  }

  await prisma.stage.delete({
    where: {
      id: stageId,
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
    message: "Stage deleted successfully.",
  };
}
