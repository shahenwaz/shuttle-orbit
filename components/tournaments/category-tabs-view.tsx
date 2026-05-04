"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Layers3, Swords, User, Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { SectionTabs } from "@/components/shared/section-tabs";
import { GroupStandingsTable } from "@/components/tournaments/group-standings-table";
import { MatchCard } from "@/components/tournaments/match-card";
import { PlayerCard } from "@/components/players/player-card";
import { TeamCard } from "@/components/tournaments/team-card";
import { computeGroupStandings } from "@/lib/tournament/standings";
import { sortStagesForDisplay } from "@/lib/tournament/stage-display-order";

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
      stageOrder: number;
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
        teamAId: string | null;
        teamBId: string | null;
        teamA: {
          teamName: string | null;
          player1: { fullName: string };
          player2: { fullName: string };
        } | null;
        teamB: {
          teamName: string | null;
          player1: { fullName: string };
          player2: { fullName: string };
        } | null;
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

function getStageMetaLabel(stage: {
  name: string;
  stageType: string;
  groups: Array<{ id: string }>;
}) {
  const stageType = stage.stageType.toLowerCase();
  const stageName = stage.name.toLowerCase();

  if (
    stageType.includes("knockout") ||
    stageType.includes("single_elimination") ||
    stageType.includes("elimination") ||
    stageType.includes("final")
  ) {
    return "KNOCKOUT";
  }

  if (stageType.includes("round_robin") || stageType.includes("group")) {
    return "ROUND ROBIN";
  }

  if (stage.groups.length > 0) {
    return "ROUND ROBIN";
  }

  if (
    stageName.includes("semi final") ||
    stageName.includes("semi-final") ||
    stageName.includes("quarter final") ||
    stageName.includes("quarter-final") ||
    stageName.includes("third place") ||
    stageName === "final"
  ) {
    return "KNOCKOUT";
  }

  return stage.stageType.replaceAll("_", " ").toUpperCase();
}

export function CategoryTabsView({ category }: CategoryTabsViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("players");

  const players = useMemo(
    () => getUniquePlayers(category.teamEntries),
    [category.teamEntries],
  );

  const orderedStages = useMemo(
    () => sortStagesForDisplay(category.stages),
    [category.stages],
  );

  const orderedMatchStages = useMemo(
    () => orderedStages.filter((stage) => stage.matches.length > 0),
    [orderedStages],
  );

  const stagesWithGroups = useMemo(
    () =>
      orderedStages.filter(
        (stage) => stage.groups.length > 0 && stage.matches.length > 0,
      ),
    [orderedStages],
  );

  const totalMatches = useMemo(
    () => category.stages.reduce((sum, stage) => sum + stage.matches.length, 0),
    [category.stages],
  );

  const totalGroups = useMemo(
    () => category.stages.reduce((sum, stage) => sum + stage.groups.length, 0),
    [category.stages],
  );

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "players", label: "Players" },
    { key: "teams", label: "Teams" },
    { key: "matches", label: "Matches" },
    { key: "standings", label: "Standings" },
  ];

  return (
    <section className="min-w-0 space-y-4 sm:space-y-5">
      <SectionTabs
        activeKey={activeTab}
        items={tabs}
        onChange={(key) => setActiveTab(key as TabKey)}
      />

      {activeTab === "players" ? (
        <div className="space-y-3 sm:space-y-4">
          <SectionMetaLine icon={<User className="h-3.5 w-3.5" />}>
            Total{" "}
            <span className="font-semibold text-primary">{players.length}</span>{" "}
            participant{players.length === 1 ? "" : "s"} in this category
          </SectionMetaLine>

          {players.length === 0 ? (
            <EmptyState message="No players available yet." />
          ) : (
            <div className="grid min-w-0 gap-1.5 sm:gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.id}`}
                  className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  <PlayerCard player={player} />
                </Link>
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
            <EmptyState message="No teams available yet." />
          ) : (
            <div className="grid min-w-0 gap-1.5 sm:gap-2 md:grid-cols-2">
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

          {orderedMatchStages.length === 0 ? (
            <EmptyState message="No matches available yet." />
          ) : (
            orderedMatchStages.map((stage) => (
              <div key={stage.id} className="surface-card p-3 sm:p-4">
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">
                    {stage.name}
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
                    {getStageMetaLabel(stage)} · {stage.matches.length} match
                    {stage.matches.length === 1 ? "" : "es"}
                  </p>
                </div>

                <div className="grid gap-1.5 sm:gap-2 lg:grid-cols-2">
                  {stage.matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}

      {activeTab === "standings" ? (
        <div className="space-y-2.5 sm:space-y-3">
          <SectionMetaLine icon={<Layers3 className="h-3.5 w-3.5" />}>
            Showing{" "}
            <span className="font-semibold text-primary">{totalGroups}</span>{" "}
            group{totalGroups === 1 ? "" : "s"} across all stages
          </SectionMetaLine>

          {stagesWithGroups.length === 0 ? (
            <EmptyState message="No group standings available yet." />
          ) : (
            stagesWithGroups.map((stage) => (
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
                      {getStageMetaLabel(stage)}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-white/10 bg-background/60 px-2 py-1 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
                    {stage.groups.length} group
                    {stage.groups.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {stage.groups.map((group) => {
                    const groupMatches = stage.matches.filter(
                      (match) => match.groupId === group.id,
                    );

                    const validGroupMatches = groupMatches.filter(
                      (match) =>
                        match.teamAId &&
                        match.teamBId &&
                        match.teamA &&
                        match.teamB,
                    );

                    const standings = computeGroupStandings(
                      group.memberships.map((membership) => ({
                        id: membership.id,
                        teamEntry: membership.teamEntry,
                      })),
                      validGroupMatches.map((match) => ({
                        id: match.id,
                        status: match.status,
                        teamAId: match.teamAId as string,
                        teamBId: match.teamBId as string,
                        winnerId: match.winnerId,
                        teamA: {
                          id: match.teamAId as string,
                          ...match.teamA!,
                        },
                        teamB: {
                          id: match.teamBId as string,
                          ...match.teamB!,
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

                        <GroupStandingsTable rows={standings} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </section>
  );
}
