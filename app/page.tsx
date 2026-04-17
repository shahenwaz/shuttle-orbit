import Link from "next/link";
import { ArrowRight, Medal, Settings2, Users } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Flexible tournament formats",
    description:
      "Support group stages, knockouts, finals, and real-world admin adjustments without hardcoding one rigid format.",
    icon: Settings2,
  },
  {
    title: "Persistent player records",
    description:
      "Keep long-term player history, participation, and rankings across tournaments even when doubles partners change.",
    icon: Users,
  },
  {
    title: "Community-ready experience",
    description:
      "Publish fixtures, standings, results, and leaderboards in a modern public experience for your badminton community.",
    icon: Medal,
  },
];

export default function HomePage() {
  return (
    <PageContainer className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            Built for flexible community badminton tournaments
          </div>

          <div className="space-y-4">
            <h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Run tournaments properly. Track players for the long term.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              A professional badminton tournament management platform for
              category-based competitions, standings, results, player records,
              and future ranking systems.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full px-6">
              <Link href="/admin">
                Open Admin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/tournaments">Browse Tournaments</Link>
            </Button>
          </div>
        </div>

        <Card className="rounded-3xl border-white/10 bg-white/5 shadow-2xl shadow-black/20">
          <CardHeader>
            <CardTitle>Foundation status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Project shell initialized.</p>
            <p>Dark theme foundation added.</p>
            <p>Prisma setup comes next in a guided beginner-safe milestone.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="h-full rounded-3xl border-white/10 bg-white/5 shadow-lg shadow-black/10"
            >
              <CardHeader className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-background/60">
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
