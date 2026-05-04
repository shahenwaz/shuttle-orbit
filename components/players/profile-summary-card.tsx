import { cn } from "@/lib/utils";

type ProfileSummaryCardProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

export function ProfileSummaryCard({
  label,
  value,
  className,
}: ProfileSummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/4 px-3 py-3 sm:px-4 sm:py-3.5",
        className,
      )}
    >
      <div className="space-y-1.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px]">
          {label}
        </p>

        <p className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          {value}
        </p>
      </div>
    </div>
  );
}
