import { surfaceCardClassName } from "@/components/shared/surface-card";
import { formatTeamName } from "@/lib/utils/format";

type TeamCardProps = {
  team: {
    id: string;
    teamName: string | null;
    player1: {
      id: string;
      fullName: string;
      nickname: string | null;
    };
    player2: {
      id: string;
      fullName: string;
      nickname: string | null;
    };
  };
  badgeLabel?: string;
};

export function TeamCard({ team, badgeLabel = "Team" }: TeamCardProps) {
  const teamLabel = formatTeamName(
    team.player1.fullName,
    team.player2.fullName,
    team.teamName,
  );

  return (
    <article
      className={surfaceCardClassName({
        variant: "elevated",
        accent: "purple",
        className:
          "group min-w-0 overflow-hidden px-3 py-1.5 transition sm:px-3.5",
      })}
    >
      <div className="min-w-0 space-y-1">
        <div className="flex min-w-0 items-baseline gap-1.5">
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {badgeLabel}
          </span>

          <span className="shrink-0 text-white/20">-</span>

          <h3 className="min-w-0 truncate text-xs font-semibold tracking-tight text-primary transition group-hover:text-purple-100 sm:text-[15px]">
            {teamLabel}
          </h3>
        </div>

        <div className="space-y-0.5 border-t border-white/10 pt-2">
          <PlayerLine
            name={team.player1.fullName}
            nickname={team.player1.nickname}
          />
          <PlayerLine
            name={team.player2.fullName}
            nickname={team.player2.nickname}
          />
        </div>
      </div>
    </article>
  );
}

function PlayerLine({
  name,
  nickname,
}: {
  name: string;
  nickname: string | null;
}) {
  return (
    <p className="min-w-0 truncate text-xs font-semibold leading-5 text-purple-400 sm:text-[13px]">
      {name}
      {nickname ? (
        <span className="ml-1.5 font-medium text-muted-foreground">
          @{nickname}
        </span>
      ) : null}
    </p>
  );
}
