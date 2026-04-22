type PlayerCardProps = {
  player: {
    id: string;
    fullName: string;
    nickname: string;
    categoryCodes?: string[];
  };
};

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="rounded-md border border-white/10 bg-white/4 px-3 py-2.5 backdrop-blur-sm transition hover:border-primary/40 hover:bg-white/5 sm:px-4 sm:py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[13px] font-bold uppercase tracking-[0.08em] text-purple-400 sm:text-sm">
          {player.fullName}
          <span className="ml-2 font-medium normal-case tracking-normal text-muted-foreground">
            - @{player.nickname}
          </span>
        </p>

        {player.categoryCodes && player.categoryCodes.length > 0 ? (
          <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-primary/90">
            {player.categoryCodes.join(" · ")}
          </span>
        ) : null}
      </div>
    </div>
  );
}
