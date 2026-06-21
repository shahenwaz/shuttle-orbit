import { ConnectedTabs } from "@/components/shared/connected-tabs";
import { HeaderSurface } from "@/components/shared/header-surface";

export type PublicCategoryTab =
  | "info"
  | "players"
  | "teams"
  | "matches"
  | "standings";

type PublicCategoryDetailHeaderProps = {
  tournament: {
    name: string;
    slug: string;
  };
  category: {
    name: string;
    rulesSummary: string | null;
  };
  activeTab: PublicCategoryTab;
  baseHref: string;
};

export function PublicCategoryDetailHeader({
  tournament,
  category,
  activeTab,
  baseHref,
}: PublicCategoryDetailHeaderProps) {
  const tabs = [
    {
      value: "info",
      label: "Info",
      href: baseHref,
    },
    {
      value: "players",
      label: "Players",
      href: `${baseHref}?tab=players`,
    },
    {
      value: "teams",
      label: "Teams",
      href: `${baseHref}?tab=teams`,
    },
    {
      value: "matches",
      label: "Matches",
      href: `${baseHref}?tab=matches`,
    },
    {
      value: "standings",
      label: "Standings",
      href: `${baseHref}?tab=standings`,
    },
  ];

  return (
    <HeaderSurface
      title={category.name}
      variant="tournament"
      meta={<span className="truncate text-primary">{tournament.name}</span>}
      className="border-b-0"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ConnectedTabs
          activeValue={activeTab}
          activeClassName="!bg-[#05090d] !text-white shadow-none"
          inactiveClassName="bg-white/6 text-muted-foreground hover:bg-white/10 hover:text-foreground"
          items={tabs}
        />
      </div>
    </HeaderSurface>
  );
}
