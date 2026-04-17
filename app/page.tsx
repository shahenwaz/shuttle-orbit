import Link from "next/link";
import { ArrowRight, Medal, Settings2, Users } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Flexible tournament formats",
    description:
      "Support group stages, knockouts, finals, and real-world admin adjustments without hardcoding one format.",
    icon: Settings2,
  },
  {
    title: "Persistent player records",
    description:
      "Keep long-term player history, appearances, and rankings across tournaments even when doubles partners change.",
    icon: Users,
  },
  {
    title: "Community-ready experience",
    description:
      "Publish fixtures, standings, results, and leaderboards in a clean public experience for your badminton community.",
    icon: Medal,
  },
];

export default function HomePage() {
  return (
    <PageContainer className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-5">
          <div className="inline-flex rounded-full border bg-muted px-3 py-1 text-sm text-muted-foreground">
            Built for flexible community badminton tournaments
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Run tournaments properly. Track players for the long term.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              A professional badminton tournament management platform for
              community events, category-based competition formats, standings,
              results, player records, and future ranking systems.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/admin">
                Open Admin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/tournaments">Browse Tournaments</Link>
            </Button>
          </div>
        </div>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Foundation status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Project shell initialized.</p>
            <p>Public and admin route foundations prepared.</p>
            <p>Prisma setup comes next in a guided milestone.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="h-full">
              <CardHeader className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-muted">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </PageContainer>
  );
}
