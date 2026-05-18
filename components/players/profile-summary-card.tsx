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
        "rounded-2xl border border-white/10 bg-white/4 px-2.5 py-2.5 sm:px-4 sm:py-3",
        className,
      )}
    >
      <div className="space-y-1">
        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
          {label}
        </p>

        <p className="wrap-break-word text-sm font-bold leading-tight tracking-tight text-foreground sm:text-lg">
          {value}
        </p>
      </div>
    </div>
  );
}
