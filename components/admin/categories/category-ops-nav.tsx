import { ConnectedTabs } from "@/components/shared/connected-tabs";

export type CategoryOpsTab =
  | "teams"
  | "groups"
  | "fixtures"
  | "results"
  | "bracket";

type CategoryOpsNavProps = {
  tournamentId: string;
  categoryId: string;
  activeTab: CategoryOpsTab;
};

const categoryTabs: {
  value: CategoryOpsTab;
  label: string;
  hrefSegment: string | null;
}[] = [
  {
    value: "teams",
    label: "Teams",
    hrefSegment: "teams",
  },
  {
    value: "groups",
    label: "Groups",
    hrefSegment: "groups",
  },
  {
    value: "fixtures",
    label: "Fixtures",
    hrefSegment: "fixtures",
  },
  {
    value: "results",
    label: "Results",
    hrefSegment: "results",
  },
  {
    value: "bracket",
    label: "Bracket",
    hrefSegment: null,
  },
];

export function CategoryOpsNav({
  tournamentId,
  categoryId,
  activeTab,
}: CategoryOpsNavProps) {
  const baseHref = `/admin/tournaments/${tournamentId}/categories/${categoryId}`;

  return (
    <ConnectedTabs
      activeValue={activeTab}
      items={categoryTabs.map((tab) => ({
        value: tab.value,
        label: tab.label,
        href: tab.hrefSegment ? `${baseHref}/${tab.hrefSegment}` : baseHref,
      }))}
    />
  );
}
