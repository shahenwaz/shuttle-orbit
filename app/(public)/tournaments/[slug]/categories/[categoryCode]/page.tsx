import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryByTournamentAndCode } from "@/lib/tournament/queries";
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
    <PageContainer className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">
          {tournament.name}
        </p>
        <h2 className="text-4xl font-bold tracking-tight">{category.name}</h2>
        {category.rulesSummary ? (
          <p className="max-w-3xl text-muted-foreground">
            {category.rulesSummary}
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-3xl border-white/10 bg-white/5">
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
                  className="rounded-2xl border border-white/10 bg-background/40 p-4"
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

        <div className="space-y-4">
          {category.stages.map((stage: StageItem) => (
            <Card
              key={stage.id}
              className="rounded-3xl border-white/10 bg-white/5"
            >
              <CardHeader>
                <CardTitle>{stage.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Groups
                  </p>
                  {stage.groups.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No groups created yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {stage.groups.map((group: GroupItem) => (
                        <div
                          key={group.id}
                          className="rounded-2xl border border-white/10 bg-background/40 p-4"
                        >
                          <p className="font-medium">{group.name}</p>
                          <div className="mt-3 space-y-2">
                            {group.memberships.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                No teams assigned yet.
                              </p>
                            ) : (
                              group.memberships.map(
                                (membership: MembershipItem) => {
                                  const team = membership.teamEntry;

                                  return (
                                    <p
                                      key={membership.id}
                                      className="text-sm text-muted-foreground"
                                    >
                                      {formatTeamName(
                                        team.player1.fullName,
                                        team.player2.fullName,
                                        team.teamName,
                                      )}
                                    </p>
                                  );
                                },
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Matches
                  </p>
                  {stage.matches.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No matches generated yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {stage.matches.map((match: MatchItem) => (
                        <div
                          key={match.id}
                          className="rounded-2xl border border-white/10 bg-background/40 p-4"
                        >
                          <p className="font-medium">
                            {formatTeamName(
                              match.teamA.player1.fullName,
                              match.teamA.player2.fullName,
                              match.teamA.teamName,
                            )}{" "}
                            vs{" "}
                            {formatTeamName(
                              match.teamB.player1.fullName,
                              match.teamB.player2.fullName,
                              match.teamB.teamName,
                            )}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Status: {match.status}
                          </p>
                          {match.scoreSummary ? (
                            <p className="mt-1 text-sm text-muted-foreground">
                              Score: {match.scoreSummary}
                            </p>
                          ) : null}
                        </div>
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
