import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { GroupStandingsTable } from "@/components/tournaments/group-standings-table";
import { MatchCard } from "@/components/tournaments/match-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryByTournamentAndCode } from "@/lib/tournament/queries";
import { computeGroupStandings } from "@/lib/tournament/standings";
import { formatTeamName } from "@/lib/utils/format";

type CategoryDetailPageProps = {
  params: Promise<{
    slug: string;
    categoryCode: string;
  }>;
};

type CategoryQueryResult = Awaited<
  ReturnType<typeof getCategoryByTournamentAndCode>
>;
type CategoryItem = NonNullable<CategoryQueryResult["category"]>;
type TeamEntryItem = CategoryItem["teamEntries"][number];
type StageItem = CategoryItem["stages"][number];
type GroupItem = StageItem["groups"][number];
type MembershipItem = GroupItem["memberships"][number];
type MatchItem = StageItem["matches"][number];

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { slug, categoryCode } = await params;
  const { tournament, category } = await getCategoryByTournamentAndCode(
    slug,
    categoryCode,
  );

  if (!tournament || !category) {
    notFound();
  }

  return (
    <PageContainer className="min-w-0 space-y-6 overflow-x-hidden">
      <section className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">
          {tournament.name}
        </p>

        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {category.name}
        </h2>

        {category.rulesSummary ? (
          <p className="max-w-3xl text-muted-foreground">
            {category.rulesSummary}
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr] xl:items-start">
        <Card className="min-w-0 rounded-3xl border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Registered teams</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {category.teamEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No teams registered yet.
              </p>
            ) : (
              category.teamEntries.map((team: TeamEntryItem) => (
                <div
                  key={team.id}
                  className="rounded-2xl border border-white/10 bg-background/40 px-4 py-3"
                >
                  <p className="font-medium">
                    {formatTeamName(
                      team.player1.fullName,
                      team.player2.fullName,
                      team.teamName,
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {team.player1.fullName} & {team.player2.fullName}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-4">
          {category.stages.map((stage: StageItem) => (
            <Card
              key={stage.id}
              className="min-w-0 rounded-3xl border-white/10 bg-white/5"
            >
              <CardHeader className="space-y-2">
                <CardTitle>{stage.name}</CardTitle>
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  {stage.stageType.replaceAll("_", " ")}
                </p>
              </CardHeader>

              <CardContent className="min-w-0 space-y-5">
                {stage.groups.length > 0 ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold tracking-tight">
                        Groups & standings
                      </h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Live standings update automatically from completed
                        matches.
                      </p>
                    </div>

                    {stage.groups.map((group: GroupItem) => {
                      const groupMatches = stage.matches.filter(
                        (match: MatchItem) => match.groupId === group.id,
                      );

                      const standings = computeGroupStandings(
                        group.memberships.map((membership: MembershipItem) => ({
                          id: membership.id,
                          teamEntry: membership.teamEntry,
                        })),
                        groupMatches.map((match: MatchItem) => ({
                          id: match.id,
                          status: match.status,
                          teamAId: match.teamAId,
                          teamBId: match.teamBId,
                          winnerId: match.winnerId,
                          teamA: match.teamA,
                          teamB: match.teamB,
                          sets: match.sets.map((set) => ({
                            setNumber: set.setNumber,
                            teamAScore: set.teamAScore,
                            teamBScore: set.teamBScore,
                          })),
                        })),
                      );

                      return (
                        <div
                          key={group.id}
                          className="min-w-0 space-y-3 rounded-2xl border border-white/10 bg-background/40 p-4"
                        >
                          <h4 className="text-base font-semibold">
                            {group.name}
                          </h4>

                          <GroupStandingsTable rows={standings} />
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Matches</h3>
                    <p className="text-sm text-muted-foreground">
                      Completed and scheduled matches for this stage.
                    </p>
                  </div>

                  {stage.matches.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No matches generated yet.
                    </p>
                  ) : (
                    <div className="grid gap-3">
                      {stage.matches.map((match: MatchItem) => (
                        <MatchCard
                          key={match.id}
                          match={{
                            id: match.id,
                            status: match.status,
                            roundLabel: match.roundLabel,
                            scoreSummary: match.scoreSummary,
                            winnerId: match.winnerId,
                            teamAId: match.teamAId,
                            teamBId: match.teamBId,
                            teamA: {
                              teamName: match.teamA.teamName,
                              player1: {
                                fullName: match.teamA.player1.fullName,
                              },
                              player2: {
                                fullName: match.teamA.player2.fullName,
                              },
                            },
                            teamB: {
                              teamName: match.teamB.teamName,
                              player1: {
                                fullName: match.teamB.player1.fullName,
                              },
                              player2: {
                                fullName: match.teamB.player2.fullName,
                              },
                            },
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
