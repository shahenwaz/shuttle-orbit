"use server";

import { ClubLeagueFormat, type Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createDoublesEntries,
  createTeamPairMatrixMatches,
} from "@/lib/club-league/team-pair-matrix";
import { prisma } from "@/lib/db/prisma";

export type ClubLeagueActionState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    title?: string[];
    playedAt?: string[];
    sideAName?: string[];
    sideBName?: string[];
    sideAMemberIds?: string[];
    sideBMemberIds?: string[];
  };
};

type PlayerInput = {
  id: string;
  name: string;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getStringArray(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string");
}

function createPlayerNickname(member: {
  name: string;
  nickname: string | null;
}) {
  return member.nickname?.trim() || member.name.trim();
}

export async function createTeamPairMatrixLeagueAction(
  _state: ClubLeagueActionState,
  formData: FormData,
): Promise<ClubLeagueActionState> {
  const clubId = getStringValue(formData, "clubId");
  const title = getStringValue(formData, "title");
  const playedAtValue = getStringValue(formData, "playedAt");
  const rulesNote = getStringValue(formData, "rulesNote");
  const sideAName = getStringValue(formData, "sideAName") || "Team A";
  const sideBName = getStringValue(formData, "sideBName") || "Team B";
  const sideAMemberIds = getStringArray(formData, "sideAMemberIds");
  const sideBMemberIds = getStringArray(formData, "sideBMemberIds");

  const fieldErrors: ClubLeagueActionState["fieldErrors"] = {};

  if (!title) {
    fieldErrors.title = ["League title is required."];
  }

  if (!playedAtValue) {
    fieldErrors.playedAt = ["Played date is required."];
  }

  if (sideAMemberIds.length < 2) {
    fieldErrors.sideAMemberIds = ["Select at least 2 members for Side A."];
  }

  if (sideBMemberIds.length < 2) {
    fieldErrors.sideBMemberIds = ["Select at least 2 members for Side B."];
  }

  const allMemberIds = [...sideAMemberIds, ...sideBMemberIds];
  const uniqueMemberIds = new Set(allMemberIds);

  if (uniqueMemberIds.size !== allMemberIds.length) {
    fieldErrors.sideAMemberIds = ["A member can only be selected once."];
    fieldErrors.sideBMemberIds = ["A member can only be selected once."];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const playedAt = new Date(`${playedAtValue}T00:00:00`);

  if (Number.isNaN(playedAt.getTime())) {
    return {
      success: false,
      message: "Please enter a valid played date.",
      fieldErrors: {
        playedAt: ["Invalid date."],
      },
    };
  }

  const managedClub = await prisma.club.findFirst({
    where: {
      id: clubId,
      isManagedClub: true,
    },
    select: {
      id: true,
      members: {
        where: {
          id: {
            in: allMemberIds,
          },
        },
        select: {
          id: true,
          name: true,
          nickname: true,
          playerId: true,
          player: {
            select: {
              id: true,
              fullName: true,
              nickname: true,
            },
          },
        },
      },
    },
  });

  if (!managedClub) {
    return {
      success: false,
      message: "Managed club could not be found.",
    };
  }

  if (managedClub.members.length !== allMemberIds.length) {
    return {
      success: false,
      message: "Only managed club members can be selected.",
    };
  }

  const memberPlayerMap = new Map<string, PlayerInput>();

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    for (const member of managedClub.members) {
      if (member.player) {
        memberPlayerMap.set(member.id, {
          id: member.player.id,
          name: member.player.nickname || member.player.fullName,
        });
        continue;
      }

      const createdPlayer = await tx.player.create({
        data: {
          fullName: member.name,
          nickname: createPlayerNickname(member),
        },
        select: {
          id: true,
          fullName: true,
          nickname: true,
        },
      });

      await tx.clubMember.update({
        where: {
          id: member.id,
        },
        data: {
          playerId: createdPlayer.id,
        },
      });

      memberPlayerMap.set(member.id, {
        id: createdPlayer.id,
        name: createdPlayer.nickname || createdPlayer.fullName,
      });
    }
  });

  const sideAPlayers: PlayerInput[] = sideAMemberIds.map((memberId: string) => {
    const player = memberPlayerMap.get(memberId);

    if (!player) {
      throw new Error("A selected Side A member could not be resolved.");
    }

    return player;
  });

  const sideBPlayers: PlayerInput[] = sideBMemberIds.map((memberId: string) => {
    const player = memberPlayerMap.get(memberId);

    if (!player) {
      throw new Error("A selected Side B member could not be resolved.");
    }

    return player;
  });

  const sideAEntries = createDoublesEntries("A", sideAPlayers, 1);
  const sideBEntries = createDoublesEntries(
    "B",
    sideBPlayers,
    sideAEntries.length + 1,
  );

  const generatedMatches = createTeamPairMatrixMatches(
    sideAEntries,
    sideBEntries,
  );

  const league = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const createdLeague = await tx.clubLeague.create({
        data: {
          clubId: managedClub.id,
          title,
          playedAt,
          format: ClubLeagueFormat.TEAM_PAIR_MATRIX,
          rulesNote: rulesNote || null,
        },
      });

      const sideA = await tx.clubLeagueSide.create({
        data: {
          leagueId: createdLeague.id,
          name: sideAName,
          sideOrder: 1,
        },
      });

      const sideB = await tx.clubLeagueSide.create({
        data: {
          leagueId: createdLeague.id,
          name: sideBName,
          sideOrder: 2,
        },
      });

      const createdSideAEntries = await Promise.all(
        sideAEntries.map((entry) =>
          tx.clubLeagueEntry.create({
            data: {
              leagueId: createdLeague.id,
              sideId: sideA.id,
              player1Id: entry.player1Id,
              player2Id: entry.player2Id,
              displayName: entry.displayName,
              entryOrder: entry.entryOrder,
            },
          }),
        ),
      );

      const createdSideBEntries = await Promise.all(
        sideBEntries.map((entry) =>
          tx.clubLeagueEntry.create({
            data: {
              leagueId: createdLeague.id,
              sideId: sideB.id,
              player1Id: entry.player1Id,
              player2Id: entry.player2Id,
              displayName: entry.displayName,
              entryOrder: entry.entryOrder,
            },
          }),
        ),
      );

      await Promise.all(
        generatedMatches.map((match) =>
          tx.clubLeagueMatch.create({
            data: {
              leagueId: createdLeague.id,
              entryAId: createdSideAEntries[match.entryAIndex].id,
              entryBId: createdSideBEntries[match.entryBIndex].id,
              matchOrder: match.matchOrder,
              roundLabel: match.roundLabel,
            },
          }),
        ),
      );

      return createdLeague;
    },
  );

  revalidatePath("/admin/club-leagues");
  redirect(`/admin/club-leagues/${league.id}`);
}
