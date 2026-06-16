import { Building2, ListOrdered, Trophy, Users } from "lucide-react";

import { AdminOverviewCard } from "@/components/admin/overview/admin-overview-card";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { PageContainer } from "@/components/layout/page-container";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
import { getAdminDashboardStats } from "@/lib/tournament/queries";

const adminSections = [
  {
    title: "Players",
    description:
      "Create and manage the reusable player base used across tournaments, clubs, teams, and leagues.",
    icon: Users,
    href: "/admin/players",
    cta: "Manage players",
    ctaVariant: "neutral" as const,
  },
  {
    title: "Tournaments",
    description:
      "Create tournaments, define categories, and manage official event structures from one place.",
    icon: Trophy,
    href: "/admin/tournaments",
    cta: "Manage tournaments",
    ctaVariant: "create" as const,
  },
  {
    title: "Clubs",
    description:
      "Manage club profiles, member access, assigned players, and club session planning.",
    icon: Building2,
    href: "/admin/clubs",
    cta: "Manage clubs",
    ctaVariant: "neutral" as const,
  },
  {
    title: "Leagues",
    description:
      "Create community leagues, generate fixtures, record results, and review standalone standings.",
    icon: ListOrdered,
    href: "/admin/leagues",
    cta: "Manage leagues",
    ctaVariant: "neutral" as const,
  },
];

export default async function AdminPage() {
  const stats = await getAdminDashboardStats();

  return (
    <PageContainer className="space-y-5 sm:space-y-6">
      <AdminShellHeader title="Admin overview" />

      <CompactStatRow>
        <CompactStatPill label="Tour" value={stats.tournamentCount} />
        <CompactStatPill label="Players" value={stats.playerCount} />
        <CompactStatPill label="Teams" value={stats.teamCount} />
        <CompactStatPill label="Matches" value={stats.matchCount} />
      </CompactStatRow>

      <section className="grid gap-2 sm:gap-2.5 lg:grid-cols-2">
        {adminSections.map((section) => (
          <AdminOverviewCard
            key={section.title}
            title={section.title}
            description={section.description}
            icon={section.icon}
            href={section.href}
            cta={section.cta}
            ctaVariant={section.ctaVariant}
          />
        ))}
      </section>
    </PageContainer>
  );
}
