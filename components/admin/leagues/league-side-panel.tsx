import { UsersRound } from "lucide-react";

type LeagueSidePanelProps = {
  sides: {
    id: string;
    name: string;
    sideOrder: number;
    entries: {
      id: string;
      displayName: string | null;
      entryOrder: number;
      player1: {
        fullName: string;
        nickname: string | null;
      };
      player2: {
        fullName: string;
        nickname: string | null;
      } | null;
    }[];
  }[];
};

function getPlayerName(player: { fullName: string; nickname: string | null }) {
  return player.nickname || player.fullName;
}

function getEntryName(
  entry: LeagueSidePanelProps["sides"][number]["entries"][number],
) {
  if (entry.displayName) {
    return entry.displayName;
  }

  if (!entry.player2) {
    return getPlayerName(entry.player1);
  }

  return `${getPlayerName(entry.player1)} + ${getPlayerName(entry.player2)}`;
}

export function LeagueSidePanel({ sides }: LeagueSidePanelProps) {
  return (
    <section className="space-y-3">
      {sides.map((side) => (
        <div
          key={side.id}
          className="rounded-md border border-white/10 bg-white/4 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
                Side {side.sideOrder}
              </p>
              <h2 className="mt-1 text-base font-semibold text-foreground">
                {side.name}
              </h2>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
              <UsersRound className="size-3.5" />
              {side.entries.length} entries
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {side.entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-background/50 px-3 py-2"
              >
                <span className="text-sm font-medium text-foreground">
                  {getEntryName(entry)}
                </span>
                <span className="text-xs text-muted-foreground">
                  #{entry.entryOrder}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
