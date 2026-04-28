import Link from "next/link";

type LeaderboardEntry = {
  rank: number;
  playerId: string;
  fullName: string;
  totalPoints: number;
  tournamentsCount: number;
  bestCategory: string | null;
};

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
};

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-170 text-sm">
        <thead className="border-b border-white/10 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Rank</th>
            <th className="px-4 py-3 font-medium">Player</th>
            <th className="px-4 py-3 font-medium">Best</th>
            <th className="px-4 py-3 font-medium">Points</th>
            <th className="px-4 py-3 font-medium">Tournaments</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.playerId}
              className="border-b border-white/6 last:border-b-0"
            >
              <td className="px-4 py-3 font-semibold text-foreground">
                #{entry.rank}
              </td>

              <td className="px-4 py-3">
                <Link
                  href={`/players/${entry.playerId}`}
                  className="font-medium text-foreground transition hover:text-primary"
                >
                  {entry.fullName}
                </Link>
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {entry.bestCategory ?? "—"}
              </td>

              <td className="px-4 py-3 font-semibold text-foreground">
                {entry.totalPoints}
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {entry.tournamentsCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
