import Link from "next/link";

import { cn } from "@/lib/utils";

export type ClubLeagueSectionTab = "overview" | "sides" | "fixtures";

type ClubLeagueSectionTabsProps = {
  leagueId: string;
  activeTab: ClubLeagueSectionTab;
};

const tabs: {
  value: ClubLeagueSectionTab;
  label: string;
}[] = [
  { value: "overview", label: "Overview" },
  { value: "sides", label: "Sides" },
  { value: "fixtures", label: "Fixtures" },
];

export function ClubLeagueSectionTabs({
  leagueId,
  activeTab,
}: ClubLeagueSectionTabsProps) {
  return (
    <div className="flex w-fit flex-wrap gap-1 rounded-md border border-white/10 bg-white/4 p-1">
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;

        return (
          <Link
            key={tab.value}
            href={`/admin/club-leagues/${leagueId}?tab=${tab.value}`}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition",
              isActive
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-white/6 hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
