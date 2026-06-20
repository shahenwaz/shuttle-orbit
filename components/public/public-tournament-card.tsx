import Link from "next/link";
import { MapPin } from "lucide-react";
import { surfaceCardClassName } from "@/components/shared/surface-card";
import { formatDate } from "@/lib/utils/format";

export type PublicTournamentCardData = {
  id: string;
  slug: string;
  name: string;
  status?: string | null;
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

export function PublicTournamentCard({
  tournament,
}: PublicTournamentCardProps) {
  const normalizedStatus = tournament.status?.toLowerCase();
  const isCompleted = normalizedStatus === "completed";

  const statusLabel = isCompleted ? "Completed" : "Upcoming";
  const accent = isCompleted ? "success" : "info";
  const statusClassName = isCompleted ? "text-emerald-500" : "text-sky-500";

  const titleClassName = isCompleted
    ? "text-emerald-300 group-hover:text-emerald-200"
    : "text-sky-300 group-hover:text-sky-200";

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
        accent,
        className:
          "group block overflow-hidden p-4 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/35 sm:p-5",
      })}
    >
      <div className="min-w-0 space-y-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
            <span className={statusClassName}>{statusLabel}</span>
            <span className="text-white/20">/</span>
            <span className="text-muted-foreground">
              {formatDate(tournament.eventDate)}
            </span>
          </div>

          <h2
            className={`truncate text-base font-semibold tracking-tight transition sm:text-lg ${titleClassName}`}
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

              <span className="min-w-0 truncate">
                <span className="font-medium text-foreground/80">
                  {categoryLabels}
                </span>
              </span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
