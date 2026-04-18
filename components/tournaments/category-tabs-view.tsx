"use client";

import { useMemo, useState } from "react";
import { Layers3, Swords, User, Users } from "lucide-react";

import { GroupStandingsTable } from "@/components/tournaments/group-standings-table";
import { MatchCard } from "@/components/tournaments/match-card";
import { computeGroupStandings } from "@/lib/tournament/standings";
import { formatTeamName } from "@/lib/utils/format";

type CategoryTabsViewProps = {
  category: {
    teamEntries: Array<{
      id: string;
      teamName: string | null;
      player1: {
        id: string;
        fullName: string;
        nickname: string;
      };
      player2: {
        id: string;
        fullName: string;
        nickname: string;
      };
    }>;
    stages: Array<{
      id: string;
      name: string;
      stageType: string;
      groups: Array<{
        id: string;
        name: string;
        memberships: Array<{
          id: string;
          teamEntry: {
            id: string;
            teamName: string | null;
            player1: { fullName: string };
            player2: { fullName: string };
          };
        }>;
      }>;
      matches: Array<{
        id: string;
        groupId: string | null;
        status: string;
        roundLabel: string | null;
        scoreSummary: string | null;
        winnerId: string | null;
        teamAId: string;
        teamBId: string;
        teamA: {
          teamName: string | null;
          player1: { fullName: string };
          player2: { fullName: string };
        };
        teamB: {
          teamName: string | null;
          player1: { fullName: string };
          player2: { fullName: string };
        };
        sets: Array<{
          setNumber: number;
          teamAScore: number;
          teamBScore: number;
        }>;
      }>;
    }>;
  };
};

type TabKey = "players" | "teams" | "matches" | "standings";

function getUniquePlayers(
  teamEntries: CategoryTabsViewProps["category"]["teamEntries"],
) {
  const map = new Map<
    string,
    CategoryTabsViewProps["category"]["teamEntries"][number]["player1"]
  >();

  for (const team of teamEntries) {
    map.set(team.player1.id, team.player1);
    map.set(team.player2.id, team.player2);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.fullName.localeCompare(b.fullName),
  );
}

function PlayerCard({
  player,
  partnerCount,
}: {
  player: {
    id: string;
    fullName: string;
    nickname: string;
  };
  partnerCount: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground sm:text-base">
            {player.fullName}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
            @{player.nickname}
          </p>
        </div>

        <div className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary sm:text-[11px]">
          {partnerCount} pair{partnerCount === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
}

function TeamCard({
  team,
}: {
  team: CategoryTabsViewProps["category"]["teamEntries"][number];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-3 backdrop-blur-sm sm:p-4">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-semibold text-foreground sm:text-base">
            {formatTeamName(
              team.player1.fullName,
              team.player2.fullName,
              team.teamName,
            )}
          </p>

          <div className="shrink-0 rounded-full border border-white/10 bg-background/60 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:text-[11px]">
            Team
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-background/40 px-3 py-2">
            <p className="truncate text-xs font-medium text-foreground sm:text-sm">
              {team.player1.fullName}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
              @{team.player1.nickname}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-background/40 px-3 py-2">
            <p className="truncate text-xs font-medium text-foreground sm:text-sm">
              {team.player2.fullName}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
              @{team.player2.nickname}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionMetaLine({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-muted-foreground sm:text-sm">
      <span className="shrink-0 text-primary">{icon}</span>
      <p className="leading-5">{children}</p>
    </div>
  );
}

export function CategoryTabsView({ category }: CategoryTabsViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("players");

  const players = useMemo(
    () => getUniquePlayers(category.teamEntries),
    [category.teamEntries],
  );

  const totalMatches = useMemo(
    () => category.stages.reduce((sum, stage) => sum + stage.matches.length, 0),
    [category.stages],
  );

  const totalGroups = useMemo(
    () => category.stages.reduce((sum, stage) => sum + stage.groups.length, 0),
    [category.stages],
  );

  const playerPairCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const team of category.teamEntries) {
      counts.set(team.player1.id, (counts.get(team.player1.id) ?? 0) + 1);
      counts.set(team.player2.id, (counts.get(team.player2.id) ?? 0) + 1);
    }

    return counts;
  }, [category.teamEntries]);

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "players", label: "Players" },
    { key: "teams", label: "Teams" },
    { key: "matches", label: "Matches" },
    { key: "standings", label: "Standings" },
  ];

  return (
    <section className="space-y-4 sm:space-y-5">
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex min-w-max gap-1.5 rounded-2xl border border-white/10 bg-white/4 p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "rounded-xl px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-white/6 hover:text-foreground",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "players" ? (
        <div className="space-y-3 sm:space-y-4">
          <SectionMetaLine icon={<User className="h-3.5 w-3.5" />}>
            Total{" "}
            <span className="font-semibold text-primary">{players.length}</span>{" "}
            participant{players.length === 1 ? "" : "s"} in this category
          </SectionMetaLine>

          {players.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-5 text-sm text-muted-foreground">
              No players available yet.
            </div>
          ) : (
            <div className="grid gap-2.5 sm:gap-3 md:grid-cols-2">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  partnerCount={playerPairCounts.get(player.id) ?? 0}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {activeTab === "teams" ? (
        <div className="space-y-3 sm:space-y-4">
          <SectionMetaLine icon={<Users className="h-3.5 w-3.5" />}>
            Total{" "}
            <span className="font-semibold text-primary">
              {category.teamEntries.length}
            </span>{" "}
            team{category.teamEntries.length === 1 ? "" : "s"} in this category
          </SectionMetaLine>

          {category.teamEntries.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-5 text-sm text-muted-foreground">
              No teams available yet.
            </div>
          ) : (
            <div className="grid gap-2.5 sm:gap-3">
              {category.teamEntries.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {activeTab === "matches" ? (
        <div className="space-y-3 sm:space-y-4">
          <SectionMetaLine icon={<Swords className="h-3.5 w-3.5" />}>
            Total{" "}
            <span className="font-semibold text-primary">{totalMatches}</span>{" "}
            match{totalMatches === 1 ? "" : "es"} across all stages
          </SectionMetaLine>

          {category.stages.map((stage) => (
            <div
              key={stage.id}
              className="rounded-2xl border border-white/10 bg-white/4 p-3 sm:p-4"
            >
              <div className="mb-3 sm:mb-4">
                <h3 className="text-sm font-semibold text-foreground sm:text-base">
                  {stage.name}
                </h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
                  {stage.stageType.replaceAll("_", " ")} ·{" "}
                  {stage.matches.length} match
                  {stage.matches.length === 1 ? "" : "es"}
                </p>
              </div>

              {stage.matches.length === 0 ? (
                <p className="text-xs text-muted-foreground sm:text-sm">
                  No matches generated yet.
                </p>
              ) : (
                <div className="grid gap-2.5 sm:gap-3">
                  {stage.matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === "standings" ? (
        <div className="space-y-2.5 sm:space-y-3">
          <SectionMetaLine icon={<Layers3 className="h-3.5 w-3.5" />}>
            Showing{" "}
            <span className="font-semibold text-primary">{totalGroups}</span>{" "}
            group{totalGroups === 1 ? "" : "s"} across all stages
          </SectionMetaLine>

          {category.stages.map((stage) => (
            <div
              key={stage.id}
              className="rounded-2xl border border-white/10 bg-white/4 p-3 sm:p-4"
            >
              <div className="mb-2.5 flex items-center justify-between gap-3 sm:mb-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                    {stage.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
                    {stage.stageType.replaceAll("_", " ")}
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-white/10 bg-background/60 px-2 py-1 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
                  {stage.groups.length} group
                  {stage.groups.length === 1 ? "" : "s"}
                </span>
              </div>

              {stage.groups.length === 0 ? (
                <p className="text-xs text-muted-foreground sm:text-sm">
                  No group standings for this stage.
                </p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {stage.groups.map((group) => {
                    const groupMatches = stage.matches.filter(
                      (match) => match.groupId === group.id,
                    );

                    const standings = computeGroupStandings(
                      group.memberships.map((membership) => ({
                        id: membership.id,
                        teamEntry: membership.teamEntry,
                      })),
                      groupMatches.map((match) => ({
                        id: match.id,
                        status: match.status,
                        teamAId: match.teamAId,
                        teamBId: match.teamBId,
                        winnerId: match.winnerId,
                        teamA: {
                          id: match.teamAId,
                          ...match.teamA,
                        },
                        teamB: {
                          id: match.teamBId,
                          ...match.teamB,
                        },
                        sets: match.sets,
                      })),
                    );

                    return (
                      <div
                        key={group.id}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-background/40"
                      >
                        <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4">
                          <h4 className="text-sm font-semibold text-foreground sm:text-base">
                            {group.name}
                          </h4>

                          <span className="rounded-full border border-white/10 bg-background/60 px-2 py-1 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
                            {group.memberships.length} teams
                          </span>
                        </div>

                        <div className="mx-0">
                          <GroupStandingsTable rows={standings} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
