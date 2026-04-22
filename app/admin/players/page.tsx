import { UserPlus } from "lucide-react";

import { CreateDialog } from "@/components/admin/create-dialog";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { AdminPlayersDirectory } from "@/components/admin/players/admin-players-directory";
import { CreatePlayerForm } from "@/components/admin/players/create-player-form";
import { EmptyState } from "@/components/shared/empty-state";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { PageContainer } from "@/components/layout/page-container";
import { prisma } from "@/lib/db/prisma";

function getCategoryCodeRank(code: string) {
  const normalized = code.trim().toUpperCase();

  switch (normalized) {
    case "A":
      return 300;
    case "B":
      return 200;
    case "C":
      return 100;
    default:
      return 0;
  }
}

function sortCategoryCodes(codes: string[]) {
  return [...codes].sort((a, b) => {
    const rankDiff = getCategoryCodeRank(b) - getCategoryCodeRank(a);

    if (rankDiff !== 0) {
      return rankDiff;
    }

    return a.localeCompare(b);
  });
}

export default async function AdminPlayersPage() {
  const [players, playerCount] = await Promise.all([
    prisma.player.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fullName: true,
        nickname: true,
        createdAt: true,
        teamEntriesAsPlayer1: {
          select: {
            category: {
              select: {
                code: true,
              },
            },
          },
        },
        teamEntriesAsPlayer2: {
          select: {
            category: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    }),
    prisma.player.count(),
  ]);

  const normalizedPlayers = players.map((player) => {
    const categoryCodes = Array.from(
      new Set([
        ...player.teamEntriesAsPlayer1.map((entry) => entry.category.code),
        ...player.teamEntriesAsPlayer2.map((entry) => entry.category.code),
      ]),
    );

    return {
      id: player.id,
      fullName: player.fullName,
      nickname: player.nickname,
      createdAt: player.createdAt,
      categoryCodes: sortCategoryCodes(categoryCodes),
    };
  });

  return (
    <PageContainer className="space-y-4 sm:space-y-6">
      <AdminShellHeader
        activeItem="players"
        title="Player management"
        description="Create and maintain the reusable player base for tournaments, teams, and rankings."
      />

      <section className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <CompactStatPill label="Players" value={playerCount} />

        <CreateDialog
          triggerLabel="Add player"
          title="Create player"
          description="Add a player once, then reuse them across tournament teams."
          triggerClassName={actionPillButtonClassName({
            variant: "create",
            className:
              "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
          })}
          triggerIcon={<UserPlus className="h-3.5 w-3.5" />}
        >
          <CreatePlayerForm />
        </CreateDialog>
      </section>

      {normalizedPlayers.length === 0 ? (
        <EmptyState message="No players added yet. Create the first player to start building your tournament pool." />
      ) : (
        <AdminPlayersDirectory players={normalizedPlayers} />
      )}
    </PageContainer>
  );
}
