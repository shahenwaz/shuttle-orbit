import {
  ConnectedTabs,
  type ConnectedTabItem,
} from "@/components/shared/connected-tabs";

export type LeagueSectionTab = "sides" | "fixtures" | "standings";

type LeagueSectionTabsFormat =
  | "ROUND_ROBIN"
  | "TEAM_PAIR_MATRIX"
  | "FIXED_DOUBLES"
  | "MANUAL";

type LeagueSectionTabsProps = {
  leagueId: string;
  activeTab: LeagueSectionTab;
  leagueFormat: LeagueSectionTabsFormat;
};

const tabs: {
  value: LeagueSectionTab;
  label: string;
}[] = [
  { value: "sides", label: "Teams" },
  { value: "fixtures", label: "Fixtures" },
  { value: "standings", label: "Standings" },
];

export function LeagueSectionTabs({
  leagueId,
  activeTab,
}: LeagueSectionTabsProps) {
  const items: ConnectedTabItem<LeagueSectionTab>[] = tabs.map((tab) => ({
    ...tab,
    href: `/admin/leagues/${leagueId}?tab=${tab.value}`,
  }));

  return <ConnectedTabs items={items} activeValue={activeTab} />;
}
