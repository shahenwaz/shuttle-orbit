import Link from "next/link";

import { cn } from "@/lib/utils";

type SectionTabItem = {
  key: string;
  label: string;
  href?: string;
};

type SectionTabsProps = {
  items: readonly SectionTabItem[];
  activeKey: string;
  onChange?: (key: string) => void;
  className?: string;
};

export function SectionTabs({
  items,
  activeKey,
  onChange,
  className,
}: SectionTabsProps) {
  return (
    <div className={cn("overflow-x-auto pb-1", className)}>
      <div className="inline-flex min-w-max gap-1.5 rounded-2xl border border-white/10 bg-white/4 p-1">
        {items.map((item) => {
          const isActive = activeKey === item.key;
          const tabClassName = cn(
            "rounded-xl px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
            isActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-white/6 hover:text-foreground",
          );

          if (item.href) {
            return (
              <Link key={item.key} href={item.href} className={tabClassName}>
                {item.label}
              </Link>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange?.(item.key)}
              className={tabClassName}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
