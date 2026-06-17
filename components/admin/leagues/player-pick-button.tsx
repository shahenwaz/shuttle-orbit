import type { PlayerOption } from "@/components/admin/leagues/league-form-types";

type PlayerPickButtonProps = {
  player: PlayerOption;
  isSelected: boolean;
  isBlocked: boolean;
  onToggle: (playerId: string) => void;
};

export function PlayerPickButton({
  player,
  isSelected,
  isBlocked,
  onToggle,
}: PlayerPickButtonProps) {
  return (
    <button
      type="button"
      disabled={isBlocked}
      onClick={() => onToggle(player.id)}
      className={[
        "rounded-full border px-3 py-1.5 text-xs transition",
        isSelected
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-white/10 bg-background/60 text-muted-foreground hover:bg-white/8 hover:text-foreground",
        isBlocked ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      {player.nickname || player.fullName}
    </button>
  );
}
