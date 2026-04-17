import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";

type TournamentRow = {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  eventDate: Date;
  status: string;
  _count: {
    categories: number;
    teamEntries: number;
    matches: number;
  };
};

type TournamentsTableProps = {
  tournaments: TournamentRow[];
};

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "published":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "upcoming":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    case "completed":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }
}

export function TournamentsTable({ tournaments }: TournamentsTableProps) {
  if (tournaments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No tournaments found yet. Add your first tournament from the form.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {tournaments.map((tournament) => (
        <div key={tournament.id} className="surface-panel p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-semibold text-foreground">
                  {tournament.name}
                </h4>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs ${getStatusBadgeClass(
                    tournament.status,
                  )}`}
                >
                  {tournament.status}
                </span>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{tournament.location ?? "No location set"}</p>
                <p>{formatDate(tournament.eventDate)}</p>
                <p className="break-all text-xs">{tournament.slug}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[auto_auto] sm:items-center">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Categories</p>
                  <p className="mt-1 text-base font-semibold">
                    {tournament._count.categories}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Teams</p>
                  <p className="mt-1 text-base font-semibold">
                    {tournament._count.teamEntries}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Matches</p>
                  <p className="mt-1 text-base font-semibold">
                    {tournament._count.matches}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/tournaments/${tournament.slug}`}>Public</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={`/admin/tournaments/${tournament.id}`}>
                    Manage
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
