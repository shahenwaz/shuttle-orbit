import Link from "next/link";
import { FolderKanban, ShieldCheck, Swords, Trophy, Users } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdminDashboardStats } from "@/lib/tournament/queries";

const adminSections = [
  {
    title: "Tournament setup",
    description:
      "Create tournaments, categories, and future tournament structures.",
    icon: Trophy,
  },
  {
    title: "Operations",
    description:
      "Manage teams, groups, fixtures, scoring, standings, and progression.",
    icon: FolderKanban,
  },
  {
    title: "Admin control",
    description:
      "Keep strong manual override support for real-life tournament changes.",
    icon: ShieldCheck,
  },
];

export default async function AdminPage() {
  const stats = await getAdminDashboardStats();

  return (
    <PageContainer className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Admin
        </p>
        <h2 className="text-3xl font-bold tracking-tight">
          Tournament management workspace
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          This will become the control center for tournament setup, group
          management, results entry, and future ranking administration.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-3xl border-white/10 bg-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4" />
              Tournaments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.tournamentCount}</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-white/10 bg-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.playerCount}</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-white/10 bg-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4" />
              Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.teamCount}</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-white/10 bg-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Swords className="h-4 w-4" />
              Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.matchCount}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon;

          return (
            <Card
              key={section.title}
              className="rounded-3xl border-white/10 bg-white/5"
            >
              <CardHeader className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-background/60">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {section.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <Link href="/">Back to home</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </PageContainer>
  );
}
