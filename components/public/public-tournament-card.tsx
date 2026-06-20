import Link from "next/link";
import { MapPin } from "lucide-react";

import { surfaceCardClassName } from "@/components/shared/surface-card";
import { getTournamentDisplayStatus } from "@/lib/tournament/status";
import { formatDate } from "@/lib/utils/format";

export type PublicTournamentCardData = {
  id: string;
  slug: string;
  name: string;
  eventDate: Date | string;
  location: string | null;
  _count: {
    teamEntries: number;
    matches: number;
  };
  categories: Array<{
    id: string;
    code: string;
  }>;
};

type PublicTournamentCardProps = {
  tournament: PublicTournamentCardData;
};

const statusTextClassName = {
  upcoming: "text-sky-400",
  live: "text-amber-400",
  completed: "text-emerald-400",
};

const titleTextClassName = {
  upcoming: "text-sky-400 group-hover:text-sky-100",
  live: "text-amber-400 group-hover:text-amber-100",
  completed: "text-emerald-400 group-hover:text-emerald-100",
};

export function PublicTournamentCard({
  tournament,
}: PublicTournamentCardProps) {
  const displayStatus = getTournamentDisplayStatus(tournament.eventDate);

  type CategoryRow = (typeof tournament.categories)[number];

  const categoryLabels = tournament.categories
    .map((category: CategoryRow) => category.code)
    .join(" · ");

  return (
    <Link
      href={`/tournaments/${tournament.slug}`}
      className={surfaceCardClassName({
        variant: "elevated",
        interactive: true,
        accent: displayStatus.accent,
        className:
          "group block overflow-hidden p-4 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/35 sm:p-5",
      })}
    >
      <div className="min-w-0 space-y-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
            <span className="text-muted-foreground">
              {formatDate(tournament.eventDate)}
            </span>
            <span className="text-white/20">/</span>
            <span className={statusTextClassName[displayStatus.key]}>
              {displayStatus.label}
            </span>
          </div>

          <h2
            className={`truncate text-base font-semibold tracking-tight transition sm:text-lg ${
              titleTextClassName[displayStatus.key]
            }`}
          >
            {tournament.name}
          </h2>

          <p className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground sm:text-sm">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {tournament.location ?? "Venue not set"}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 pt-3 text-xs">
          <span className="inline-flex items-baseline gap-1">
            <span className="text-sm font-semibold text-foreground">
              {tournament._count.teamEntries}
            </span>
            <span className="font-medium text-muted-foreground">teams</span>
          </span>

          <span className="h-1 w-1 rounded-full bg-white/20" />

          <span className="inline-flex items-baseline gap-1">
            <span className="text-sm font-semibold text-foreground">
              {tournament._count.matches}
            </span>
            <span className="font-medium text-muted-foreground">matches</span>
          </span>

          {categoryLabels ? (
            <>
              <span className="h-1 w-1 rounded-full bg-white/20" />

              <span className="font-medium text-foreground/80">
                {categoryLabels}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
