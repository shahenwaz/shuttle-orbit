import { PlayerIdentityRow } from "@/components/players/player-identity-row";

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
    <div className="rounded-md border border-white/10 bg-white/4 px-3 py-2 backdrop-blur-sm transition hover:border-primary/40 hover:bg-white/5 sm:px-4 sm:py-3">
      <PlayerIdentityRow
        fullName={player.fullName}
        nickname={player.nickname}
        categoryCodes={player.categoryCodes}
      />
    </div>
  );
}
