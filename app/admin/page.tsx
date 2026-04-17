import Link from "next/link";
import { FolderKanban, Trophy, Users } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdminDashboardStats } from "@/lib/tournament/queries";
import { CompactStatPill } from "@/components/admin/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/admin/stats/compact-stat-row";

const adminSections = [
  {
    title: "Players",
    description:
      "Create and manage the player base used across all tournaments and teams.",
    icon: Users,
    href: "/admin/players",
    cta: "Manage players",
  },
  {
    title: "Tournament setup",
    description:
      "Create tournaments, categories, and future tournament structures.",
    icon: Trophy,
    href: "/admin/tournaments",
    cta: "Manage tournaments",
  },
  {
    title: "Operations",
    description:
      "Manage teams, groups, fixtures, scoring, standings, and progression.",
    icon: FolderKanban,
    href: "/admin/tournaments",
    cta: "Open workspace",
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

      <CompactStatRow>
        <CompactStatPill label="Tour" value={stats.tournamentCount} />
        <CompactStatPill label="Players" value={stats.playerCount} />
        <CompactStatPill label="Teams" value={stats.teamCount} />
        <CompactStatPill label="Matches" value={stats.matchCount} />
      </CompactStatRow>

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
                  <Link href={section.href}>{section.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </PageContainer>
  );
}
