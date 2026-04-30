import { formatTeamName } from "@/lib/utils/format";

type TeamCardProps = {
  team: {
    id: string;
    teamName: string | null;
    player1: {
      fullName: string;
      nickname: string;
    };
    player2: {
      fullName: string;
      nickname: string;
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
    <div className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-white/4 p-3 backdrop-blur-sm sm:p-4">
      <div className="min-w-0 space-y-2.5">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <p className="min-w-0 max-w-full wrap-break-word text-[10px] font-medium uppercase leading-4 tracking-[0.12em] text-muted-foreground sm:text-xs sm:tracking-[0.14em]">
            {badgeLabel} -{" "}
            <span className="font-bold text-primary">{teamLabel}</span>
          </p>
        </div>

        <p className="min-w-0 max-w-full wrap-break-word text-xs font-semibold leading-4 text-foreground sm:text-sm sm:leading-5">
          <span className="font-bold text-purple-400">
            {team.player1.fullName}
          </span>
          <span className="px-1.5 font-bold">+</span>
          <span className="font-bold text-purple-400">
            {team.player2.fullName}
          </span>
        </p>
      </div>
    </div>
  );
}
