import Link from "next/link";
import { Swords, User, Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { GroupStandingsTable } from "@/components/tournaments/group-standings-table";
import { MatchCard } from "@/components/tournaments/match-card";
import { PlayerCard } from "@/components/players/player-card";
import { TeamCard } from "@/components/tournaments/team-card";
import { computeGroupStandings } from "@/lib/tournament/standings";
import { sortStagesForDisplay } from "@/lib/tournament/stage-display-order";

type CategoryOverview = {
  rulesSummary: string | null;
};

type CategoryTeamEntries = CategoryOverview & {
  teamEntries: Array<{
    id: string;
    teamName: string | null;
    player1: {
      id: string;
      fullName: string;
      nickname: string | null;
    };
    player2: {
      id: string;
      fullName: string;
      nickname: string | null;
    };
  }>;
};

type CategoryCompetition = CategoryOverview & {
  stages: Array<{
    id: string;
    name: string;
    stageType: string;
    stageOrder: number;
    groups: Array<{
      id: string;
      name: string;
      memberships: Array<{
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

type CategoryTabData =
  | {
      activeTab: "info";
      category: CategoryOverview;
    }
  | {
      activeTab: "players";
      category: CategoryTeamEntries;
    }
  | {
      activeTab: "teams";
      category: CategoryTeamEntries;
    }
  | {
      activeTab: "matches" | "standings";
      category: CategoryCompetition;
    };

type CategoryTabsViewProps = {
  data: CategoryTabData;
};

function getUniquePlayers(teamEntries: CategoryTeamEntries["teamEntries"]) {
  const map = new Map<
    string,
    CategoryTeamEntries["teamEntries"][number]["player1"]
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

function combineContextLabels(primaryLabel: string, detailLabel?: string) {
  const primary = primaryLabel.trim();
  const detail = detailLabel?.trim();

  if (!detail) {
    return primary;
  }

  const normalizedPrimary = primary.toLocaleLowerCase();
  const normalizedDetail = detail.toLocaleLowerCase();

  if (normalizedDetail.includes(normalizedPrimary)) {
    return detail;
  }

  if (normalizedPrimary.includes(normalizedDetail)) {
    return primary;
  }

  return `${primary} · ${detail}`;
}

export function CategoryTabsView({ data }: CategoryTabsViewProps) {
  const players =
    data.activeTab === "players"
      ? getUniquePlayers(data.category.teamEntries)
      : [];
  const orderedStages =
    data.activeTab === "matches" || data.activeTab === "standings"
      ? sortStagesForDisplay(data.category.stages)
      : [];
  const orderedMatchStages = orderedStages.filter(
    (stage) => stage.matches.length > 0,
  );
  const stagesWithGroups = orderedStages.filter(
    (stage) => stage.groups.length > 0,
  );
  const totalMatches =
    data.activeTab === "matches"
      ? data.category.stages.reduce(
          (sum, stage) => sum + stage.matches.length,
          0,
        )
      : 0;
  return (
    <section className="min-w-0 space-y-4 sm:space-y-5">
      {data.activeTab === "info" ? (
        <section className="max-w-3xl space-y-3 py-1">
          <h2 className="text-base font-semibold tracking-tight text-purple-400 sm:text-lg">
            Format and category details
          </h2>

          <p className="text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {data.category.rulesSummary ||
              "Category details will be updated soon."}
          </p>
        </section>
      ) : null}

      {data.activeTab === "players" ? (
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

      {data.activeTab === "teams" ? (
        <div className="space-y-3 sm:space-y-4">
          <SectionMetaLine icon={<Users className="h-3.5 w-3.5" />}>
            Total{" "}
            <span className="font-semibold text-primary">
              {data.category.teamEntries.length}
            </span>{" "}
            team{data.category.teamEntries.length === 1 ? "" : "s"} in this
            category
          </SectionMetaLine>

          {data.category.teamEntries.length === 0 ? (
            <EmptyState message="No teams available yet." />
          ) : (
            <div className="grid min-w-0 gap-1.5 sm:gap-2 md:grid-cols-2">
              {data.category.teamEntries.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {data.activeTab === "matches" ? (
        <div className="space-y-3 sm:space-y-4">
          <SectionMetaLine icon={<Swords className="h-3.5 w-3.5" />}>
            Total{" "}
            <span className="font-semibold text-primary">{totalMatches}</span>{" "}
            match{totalMatches === 1 ? "" : "es"} across all stages
          </SectionMetaLine>

          {orderedMatchStages.length === 0 ? (
            <EmptyState message="No matches available yet." />
          ) : (
            orderedMatchStages.map((stage) => {
              const groupedSections = stage.groups
                .map((group) => ({
                  id: group.id,
                  name: group.name,
                  matches: stage.matches.filter(
                    (match) => match.groupId === group.id,
                  ),
                }))
                .filter((section) => section.matches.length > 0);
              const ungroupedMatches = stage.matches.filter(
                (match) => match.groupId === null,
              );

              return (
                <div key={stage.id} className="space-y-1.5 sm:space-y-2">
                  {groupedSections.map((section) => (
                    <div
                      key={section.id}
                      className="grid gap-1.5 sm:gap-2 lg:grid-cols-2"
                    >
                      {section.matches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          contextLabel={combineContextLabels(
                            section.name,
                            match.roundLabel ?? undefined,
                          )}
                        />
                      ))}
                    </div>
                  ))}

                  {ungroupedMatches.length > 0 ? (
                    <div className="grid gap-1.5 sm:gap-2 lg:grid-cols-2">
                      {ungroupedMatches.map((match) => {
                        const contextLabel = combineContextLabels(
                          stage.name,
                          match.roundLabel ?? undefined,
                        );

                        return (
                          <MatchCard
                            key={match.id}
                            match={match}
                            contextLabel={contextLabel}
                          />
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      ) : null}

      {data.activeTab === "standings" ? (
        <div className="space-y-4 sm:space-y-5">
          {stagesWithGroups.length === 0 ? (
            <EmptyState message="No group standings available yet." />
          ) : (
            stagesWithGroups.flatMap((stage) =>
              stage.groups.map((group) => {
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
                  <section key={group.id} className="space-y-2 sm:space-y-2.5">
                    <h3 className="text-sm font-semibold text-foreground sm:text-base">
                      {stage.name} – {group.name}
                    </h3>

                    <GroupStandingsTable rows={standings} />
                  </section>
                );
              }),
            )
          )}
        </div>
      ) : null}
    </section>
  );
}
