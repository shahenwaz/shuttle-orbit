import { SectionTabs } from "@/components/shared/section-tabs";

type AdminShellNavProps = {
  activeItem: "overview" | "players" | "tournaments";
};

const navItems = [
  { key: "overview", label: "Overview", href: "/admin" },
  { key: "players", label: "Players", href: "/admin/players" },
  { key: "tournaments", label: "Tournaments", href: "/admin/tournaments" },
] as const;

export function AdminShellNav({ activeItem }: AdminShellNavProps) {
  return <SectionTabs activeKey={activeItem} items={navItems} />;
}
