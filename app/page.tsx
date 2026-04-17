import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Medal,
  Settings2,
  Users,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFeaturedTournament } from "@/lib/tournament/queries";
import { formatDate } from "@/lib/utils/format";

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
] as const;

type FeaturedTournament = NonNullable<
  Awaited<ReturnType<typeof getFeaturedTournament>>
>;
type FeaturedCategory = FeaturedTournament["categories"][number];

export default async function HomePage() {
  const featuredTournament = await getFeaturedTournament();

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
            <CardTitle>Featured tournament</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {featuredTournament ? (
              <>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {featuredTournament.name}
                  </p>
                  <p className="mt-1 text-sm">
                    {featuredTournament.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatDate(featuredTournament.startDate)}</span>
                  </div>

                  {featuredTournament.location ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{featuredTournament.location}</span>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {featuredTournament.categories.map(
                      (category: FeaturedCategory) => (
                        <span
                          key={category.id}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground"
                        >
                          {category.name}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full"
                >
                  <Link href={`/tournaments/${featuredTournament.slug}`}>
                    View tournament
                  </Link>
                </Button>
              </>
            ) : (
              <p>No tournament data found yet.</p>
            )}
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
