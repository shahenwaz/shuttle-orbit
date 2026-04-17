import { formatDate } from "@/lib/utils/format";

type PlayerRow = {
  id: string;
  fullName: string;
  nickname: string | null;
  gender: string | null;
  communityTag: string | null;
  isActive: boolean;
  createdAt: Date;
};

type PlayersTableProps = {
  players: PlayerRow[];
};

export function PlayersTable({ players }: PlayersTableProps) {
  if (players.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No players found yet. Add your first player from the form.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-background/40">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-muted-foreground">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Nickname</th>
              <th className="px-4 py-3 font-medium">Gender</th>
              <th className="px-4 py-3 font-medium">Community</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr
                key={player.id}
                className="border-b border-white/10 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {player.fullName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {player.nickname ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {player.gender ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {player.communityTag ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                    {player.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(player.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
