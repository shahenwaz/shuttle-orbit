import Link from "next/link";
import { formatDate } from "@/lib/utils/format";

type TournamentRow = {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
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
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-background/40">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-muted-foreground">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium">Tournament</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Counts</th>
              <th className="px-4 py-3 font-medium">Slug</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((tournament) => (
              <tr
                key={tournament.id}
                className="border-b border-white/10 last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {tournament.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tournament.location ?? "No location set"}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  <div className="space-y-1">
                    <p>{formatDate(tournament.startDate)}</p>
                    {tournament.endDate ? (
                      <p className="text-xs">
                        to {formatDate(tournament.endDate)}
                      </p>
                    ) : null}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs ${getStatusBadgeClass(
                      tournament.status,
                    )}`}
                  >
                    {tournament.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p>{tournament._count.categories} categories</p>
                    <p>{tournament._count.teamEntries} teams</p>
                    <p>{tournament._count.matches} matches</p>
                  </div>
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  <Link
                    href={`/tournaments/${tournament.slug}`}
                    className="break-all text-primary hover:underline"
                  >
                    {tournament.slug}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
