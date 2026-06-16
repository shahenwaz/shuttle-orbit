import Link from "next/link";

import { cn } from "@/lib/utils";

export type LeagueSectionTab = "overview" | "sides" | "fixtures";

type LeagueSectionTabsProps = {
  leagueId: string;
  activeTab: LeagueSectionTab;
};

const tabs: {
  value: LeagueSectionTab;
  label: string;
}[] = [
  { value: "overview", label: "Overview" },
  { value: "sides", label: "Sides" },
  { value: "fixtures", label: "Fixtures" },
];

export function LeagueSectionTabs({
  leagueId,
  activeTab,
}: LeagueSectionTabsProps) {
  return (
    <div className="flex w-fit flex-wrap gap-1 rounded-md border border-white/10 bg-white/4 p-1">
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;

        return (
          <Link
            key={tab.value}
            href={`/admin/leagues/${leagueId}?tab=${tab.value}`}
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
