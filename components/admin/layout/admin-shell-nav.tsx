import Link from "next/link";
import { cn } from "@/lib/utils";

type AdminShellNavProps = {
  activeItem: "overview" | "players" | "tournaments";
};

const navItems = [
  { key: "overview", label: "Overview", href: "/admin" },
  { key: "players", label: "Players", href: "/admin/players" },
  { key: "tournaments", label: "Tournaments", href: "/admin/tournaments" },
] as const;

export function AdminShellNav({ activeItem }: AdminShellNavProps) {
  return (
    <nav className="flex flex-wrap gap-2">
      {navItems.map((item) => {
        const isActive = item.key === activeItem;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "inline-flex h-9 items-center rounded-xl border px-3 text-xs font-medium uppercase tracking-[0.16em] transition",
              isActive
                ? "border-primary/30 bg-primary/12 text-primary"
                : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/8 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
