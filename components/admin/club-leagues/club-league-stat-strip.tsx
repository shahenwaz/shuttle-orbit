import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";

type ClubLeagueStatStripProps = {
  leagueCount: number;
  latestFormat?: string;
  latestMatches?: number;
};

export function ClubLeagueStatStrip({
  leagueCount,
  latestFormat,
  latestMatches = 0,
}: ClubLeagueStatStripProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <CompactStatPill label="Club leagues" value={leagueCount} />
      <CompactStatPill label="Latest format" value={latestFormat ?? "None"} />
      <CompactStatPill label="Latest matches" value={latestMatches} />
    </div>
  );
}
