import Link from "next/link";

import { surfaceCardClassName } from "@/components/shared/surface-card";

type PlayerAppearanceCardProps = {
  entry: {
    id: string;
    teamName: string | null;
    partner: {
      id: string;
      fullName: string;
    };
    categoryCode: string;
    tournament: {
      id: string;
      name: string;
      slug: string;
    };
    result: {
      finishLabel: string | null;
      rankingPoints: number;
      matchesPlayed: number;
      matchesWon: number;
    } | null;
  };
};

export function PlayerAppearanceCard({ entry }: PlayerAppearanceCardProps) {
  const categoryHref = `/tournaments/${entry.tournament.slug}/categories/${entry.categoryCode}`;
  const pointsLabel =
    entry.result && entry.result.rankingPoints > 0
      ? `+${entry.result.rankingPoints}`
      : String(entry.result?.rankingPoints ?? 0);

  return (
    <article
      className={surfaceCardClassName({
        variant: "elevated",
        accent: "info",
        className: "min-w-0 px-3 py-2 sm:px-3.5",
      })}
    >
      <div className="space-y-1">
        <Link
          href={`/tournaments/${entry.tournament.slug}`}
          className="block min-w-0 wrap-break-word text-sm leading-5 font-semibold text-sky-300 transition hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
        >
          {entry.tournament.name}
        </Link>

        <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
          <Link
            href={categoryHref}
            className="font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
          >
            {entry.categoryCode}
          </Link>

          {entry.teamName ? (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="min-w-0 wrap-break-word font-semibold text-primary">
                {entry.teamName}
              </span>
            </>
          ) : null}
        </div>

        <p className="min-w-0 text-xs leading-5 text-muted-foreground">
          Partner:{" "}
          <Link
            href={`/players/${entry.partner.id}`}
            className="wrap-break-word font-medium text-sky-300 transition hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
          >
            {entry.partner.fullName}
          </Link>
        </p>

        {entry.result ? (
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 border-t border-white/10 pt-1 text-[10px] leading-4 text-muted-foreground sm:text-[11px]">
            {entry.result.finishLabel ? (
              <span className="font-medium text-foreground">
                {entry.result.finishLabel}
              </span>
            ) : null}
            {entry.result.finishLabel ? <span>·</span> : null}
            <span>
              Wins{" "}
              <span className="font-medium text-foreground tabular-nums">
                {entry.result.matchesWon}/{entry.result.matchesPlayed}
              </span>
            </span>
            <span>·</span>
            <span className="font-medium text-foreground tabular-nums">
              {pointsLabel} pts
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
