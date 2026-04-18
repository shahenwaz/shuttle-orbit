import Link from "next/link";
import { FolderKanban, Trophy, Users } from "lucide-react";

import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdminDashboardStats } from "@/lib/tournament/queries";

const adminSections = [
  {
    title: "Players",
    description:
      "Create and manage the reusable player base used across all tournaments and teams.",
    icon: Users,
    href: "/admin/players",
    cta: "Manage players",
  },
  {
    title: "Tournaments",
    description:
      "Create tournaments, define categories, and build competition structures.",
    icon: Trophy,
    href: "/admin/tournaments",
    cta: "Manage tournaments",
  },
  {
    title: "Operations",
    description:
      "Use categories, groups, fixtures, and results flows to operate events cleanly.",
    icon: FolderKanban,
    href: "/admin/tournaments",
    cta: "Open workspace",
  },
];

export default async function AdminPage() {
  const stats = await getAdminDashboardStats();

  return (
    <PageContainer className="space-y-8">
      <AdminShellHeader
        activeItem="overview"
        title="Admin overview"
        description="Control tournaments, players, category structure, fixtures, and results from one workspace."
      />

      <CompactStatRow>
        <CompactStatPill label="Tournaments" value={stats.tournamentCount} />
        <CompactStatPill label="Players" value={stats.playerCount} />
        <CompactStatPill label="Teams" value={stats.teamCount} />
        <CompactStatPill label="Matches" value={stats.matchCount} />
      </CompactStatRow>

      <section className="grid gap-4 md:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon;

          return (
            <Card key={section.title} className="surface-card">
              <CardHeader className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-background/60">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {section.description}
                </p>
                <Button asChild variant="outline" size="sm">
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
