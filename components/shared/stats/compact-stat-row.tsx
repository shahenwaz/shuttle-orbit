import { cn } from "@/lib/utils";

type CompactStatRowProps = {
  children: React.ReactNode;
  className?: string;
};

export function CompactStatRow({ children, className }: CompactStatRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
