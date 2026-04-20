import { cn } from "@/lib/utils";

type CompactStatRowProps = {
  children: React.ReactNode;
  className?: string;
};

export function CompactStatRow({ children, className }: CompactStatRowProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-1 sm:gap-1.5", className)}
    >
      {children}
    </div>
  );
}
