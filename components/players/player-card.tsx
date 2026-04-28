import { PlayerIdentityRow } from "@/components/players/player-identity-row";
import { surfaceCardClassName } from "../shared/surface-card";

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
    <div
      className={surfaceCardClassName({
        interactive: true,
        blur: true,
        className: "px-3 py-2 sm:px-4 sm:py-3",
      })}
    >
      <PlayerIdentityRow
        fullName={player.fullName}
        nickname={player.nickname}
        categoryCodes={player.categoryCodes}
      />
    </div>
  );
}
