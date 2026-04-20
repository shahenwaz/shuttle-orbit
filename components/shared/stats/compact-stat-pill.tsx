import { cn } from "@/lib/utils";

type CompactStatPillProps = {
  label: string;
  value: string | number;
  className?: string;
};

export function CompactStatPill({
  label,
  value,
  className,
}: CompactStatPillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] sm:px-3 sm:text-xs",
        className,
      )}
    >
      <span className="font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="text-xs font-bold leading-none text-foreground sm:text-sm">
        {value}
      </span>
    </div>
  );
}
