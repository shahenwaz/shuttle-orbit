import { SectionTabs } from "@/components/shared/section-tabs";

type CategoryOpsNavProps = {
  tournamentId: string;
  categoryId: string;
  activeTab: "teams" | "groups" | "fixtures" | "results";
};

const navItems = [
  { key: "teams", label: "Teams" },
  { key: "groups", label: "Groups" },
  { key: "fixtures", label: "Fixtures" },
  { key: "results", label: "Results" },
] as const;

export function CategoryOpsNav({
  tournamentId,
  categoryId,
  activeTab,
}: CategoryOpsNavProps) {
  return (
    <SectionTabs
      activeKey={activeTab}
      items={navItems.map((item) => ({
        key: item.key,
        label: item.label,
        href: `/admin/tournaments/${tournamentId}/categories/${categoryId}/${item.key}`,
      }))}
    />
  );
}
