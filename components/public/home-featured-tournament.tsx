import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";

type HomeFeaturedTournamentProps = {
  tournament: {
    name: string;
    slug: string;
    description: string | null;
    eventDate: Date | string;
    location: string | null;
    categories: Array<{
      id: string;
      name: string;
    }>;
  } | null;
};

export function HomeFeaturedTournament({
  tournament,
}: HomeFeaturedTournamentProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/4">
          <Trophy className="h-5 w-5 text-primary" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
            Featured tournament
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Latest event
          </h2>
        </div>
      </div>

      {tournament ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/4 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.16)] sm:p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                {tournament.name}
              </h3>

              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {tournament.description ||
                  "Explore the latest tournament, view categories, and follow event progress in one place."}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>{formatDate(tournament.eventDate)}</span>
              </div>

              {tournament.location ? (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{tournament.location}</span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {tournament.categories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  {category.name}
                </span>
              ))}
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/10 bg-white/4 hover:bg-white/8"
            >
              <Link href={`/tournaments/${tournament.slug}`}>
                View tournament
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/4 p-5 text-sm text-muted-foreground sm:p-6">
          No featured tournament is available right now.
        </div>
      )}
    </section>
  );
}
