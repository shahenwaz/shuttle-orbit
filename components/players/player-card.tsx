import { surfaceCardClassName } from "../shared/surface-card";
import { getPlayerInitials } from "@/lib/player/initials";

type PlayerCardProps = {
  player: {
    fullName: string;
    nickname: string | null;
    categoryCodes?: string[];
  };
};

export function PlayerCard({ player }: PlayerCardProps) {
  const initials = getPlayerInitials(player.fullName, player.nickname);
  const nickname = player.nickname?.trim();
  const categoryLabel = player.categoryCodes?.join(" · ");

  return (
    <article
      className={surfaceCardClassName({
        interactive: true,
        variant: "elevated",
        accent: "info",
        className: "min-w-0 px-3 py-2",
      })}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 text-xs font-semibold tracking-wide text-sky-300">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-sm leading-5 font-semibold text-sky-400"
            title={player.fullName}
          >
            {player.fullName}
          </h3>

          {nickname || categoryLabel ? (
            <p className="truncate text-[11px] leading-4 font-medium text-muted-foreground sm:text-xs">
              {nickname ? `@${nickname}` : null}
              {nickname && categoryLabel ? " · " : null}
              {categoryLabel ? (
                <span className="text-sky-300/90">{categoryLabel}</span>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
