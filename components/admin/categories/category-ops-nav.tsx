import { ConnectedTabs } from "@/components/shared/connected-tabs";

type CategoryOpsNavProps = {
  tournamentId: string;
  categoryId: string;
  activeTab: "teams" | "groups" | "fixtures" | "results";
};

const categoryTabs: {
  value: CategoryOpsNavProps["activeTab"];
  label: string;
  hrefSegment: string;
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
];

export function CategoryOpsNav({
  tournamentId,
  categoryId,
  activeTab,
}: CategoryOpsNavProps) {
  return (
    <ConnectedTabs
      activeValue={activeTab}
      items={categoryTabs.map((tab) => ({
        value: tab.value,
        label: tab.label,
        href: `/admin/tournaments/${tournamentId}/categories/${categoryId}/${tab.hrefSegment}`,
      }))}
    />
  );
}
