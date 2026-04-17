import Link from "next/link";
import { FolderKanban, ShieldCheck, Trophy } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default function AdminPage() {
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

      <section className="grid gap-4 md:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon;

          return (
            <Card key={section.title}>
              <CardHeader className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-muted">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {section.description}
                </p>
                <Button asChild variant="outline" size="sm">
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
