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
    <div className="rounded-lg border border-white/10 bg-white/4 p-3 backdrop-blur-sm sm:p-4">
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground sm:text-sm">
            {badgeLabel} -{" "}
            <span className="font-bold text-primary">{teamLabel}</span>
          </p>
        </div>

        <p className="truncate text-sm font-semibold text-foreground sm:text-base">
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
