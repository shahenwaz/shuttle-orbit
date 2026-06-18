import Link from "next/link";

import { cn } from "@/lib/utils";

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
  return (
    <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <nav className="flex min-w-max items-end gap-1">
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;

          return (
            <Link
              key={tab.value}
              href={`/admin/leagues/${leagueId}?tab=${tab.value}`}
              className={cn(
                "relative -mb-px rounded-t-md px-4 py-2 text-sm font-semibold transition",
                isActive
                  ? "bg-[#0b1118] text-foreground"
                  : "bg-white/8 text-muted-foreground hover:bg-white/12 hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
