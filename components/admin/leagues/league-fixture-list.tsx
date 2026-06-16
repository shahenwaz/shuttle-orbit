import { CheckCircle2, CircleDotDashed, Swords } from "lucide-react";

type LeagueFixtureListProps = {
  matches: {
    id: string;
    matchOrder: number;
    roundLabel: string | null;
    scoreSummary: string | null;
    entryAId: string | null;
    entryBId: string | null;
    winnerEntryId: string | null;
    entryA: Entry | null;
    entryB: Entry | null;
    sets: {
      id: string;
      setNumber: number;
      entryAScore: number;
      entryBScore: number;
    }[];
  }[];
};

type Entry = {
  displayName: string | null;
  player1: {
    fullName: string;
    nickname: string | null;
  };
  player2: {
    fullName: string;
    nickname: string | null;
  } | null;
};

function getPlayerName(player: { fullName: string; nickname: string | null }) {
  return player.nickname || player.fullName;
}

function getEntryName(entry: Entry | null) {
  if (!entry) {
    return "TBC";
  }

  if (entry.displayName) {
    return entry.displayName;
  }

  if (!entry.player2) {
    return getPlayerName(entry.player1);
  }

  return `${getPlayerName(entry.player1)} + ${getPlayerName(entry.player2)}`;
}

function getScoreText(match: LeagueFixtureListProps["matches"][number]) {
  if (match.scoreSummary) {
    return match.scoreSummary;
  }

  if (match.sets.length === 0) {
    return "Score pending";
  }

  return match.sets
    .map((set) => `${set.entryAScore}-${set.entryBScore}`)
    .join(", ");
}

export function LeagueFixtureList({ matches }: LeagueFixtureListProps) {
  return (
    <section className="rounded-md border border-white/10 bg-white/4">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
            Fixtures
          </p>
          <h2 className="mt-1 text-base font-semibold text-foreground">
            Generated match list
          </h2>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
          <Swords className="size-3.5" />
          {matches.length} total
        </span>
      </div>

      <div className="divide-y divide-white/10">
        {matches.map((match) => {
          const isCompleted = Boolean(match.winnerEntryId);

          return (
            <div key={match.id} className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground">
                      Match {match.matchOrder}
                    </span>
                    {match.roundLabel ? (
                      <span className="text-xs text-muted-foreground">
                        {match.roundLabel}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
                    <span>{getEntryName(match.entryA)}</span>
                    <span className="text-xs font-medium text-muted-foreground">
                      vs
                    </span>
                    <span>{getEntryName(match.entryB)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                    {getScoreText(match)}
                  </span>

                  <span
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs",
                      isCompleted
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-white/10 bg-background/70 text-muted-foreground",
                    ].join(" ")}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <CircleDotDashed className="size-3.5" />
                    )}
                    {isCompleted ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
