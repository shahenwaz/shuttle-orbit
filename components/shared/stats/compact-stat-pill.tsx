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
        "flex min-w-18 flex-col items-center justify-center rounded-md border border-white/10 bg-white/5 p-1.5 text-center sm:min-w-24",
        className,
      )}
    >
      <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[10px]">
        {label}
      </span>
      <span className="mt-1 text-lg font-bold leading-none text-foreground sm:text-xl">
        {value}
      </span>
    </div>
  );
}
