import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type HeaderSurfaceVariant =
  | "default"
  | "league"
  | "tournament"
  | "club"
  | "player";

type HeaderSurfaceProps = {
  title: string;
  actions?: ReactNode;
  meta?: ReactNode;
  summary?: ReactNode;
  children?: ReactNode;
  variant?: HeaderSurfaceVariant;
  className?: string;
  innerClassName?: string;
};

const surfaceClassNames: Record<HeaderSurfaceVariant, string> = {
  default: "bg-[linear-gradient(135deg,#101923_0%,#0f1b22_48%,#0b1118_100%)]",
  league: "bg-[linear-gradient(135deg,#0f1b16_0%,#10261c_46%,#0b1118_100%)]",
  tournament:
    "bg-[linear-gradient(135deg,#101923_0%,#10231d_46%,#0c171d_100%)]",
  club: "bg-[linear-gradient(135deg,#101826_0%,#121f31_46%,#0b1118_100%)]",
  player: "bg-[linear-gradient(135deg,#11151f_0%,#17172a_46%,#0b1118_100%)]",
};

const accentClassNames: Record<HeaderSurfaceVariant, string> = {
  default:
    "bg-[linear-gradient(115deg,rgba(52,211,153,0.1)_0%,transparent_34%),linear-gradient(255deg,rgba(14,165,233,0.07)_0%,transparent_42%)]",
  league:
    "bg-[linear-gradient(115deg,rgba(34,197,94,0.12)_0%,transparent_34%),linear-gradient(255deg,rgba(20,184,166,0.07)_0%,transparent_42%)]",
  tournament:
    "bg-[linear-gradient(115deg,rgba(52,211,153,0.13)_0%,transparent_34%),linear-gradient(255deg,rgba(45,212,191,0.07)_0%,transparent_42%)]",
  club: "bg-[linear-gradient(115deg,rgba(96,165,250,0.1)_0%,transparent_34%),linear-gradient(255deg,rgba(52,211,153,0.06)_0%,transparent_42%)]",
  player:
    "bg-[linear-gradient(115deg,rgba(168,85,247,0.1)_0%,transparent_34%),linear-gradient(255deg,rgba(52,211,153,0.06)_0%,transparent_42%)]",
};

export function HeaderSurface({
  title,
  actions,
  meta,
  summary,
  children,
  variant = "default",
  className,
  innerClassName,
}: HeaderSurfaceProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        surfaceClassNames[variant],
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          accentClassNames[variant],
        )}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-linear-to-r from-[#0b1118]/28 via-transparent to-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent via-[#0b1118]/8 to-[#0b1118]/38"
      />

      <div
        className={cn(
          "relative mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6 lg:px-8",
          innerClassName,
        )}
      >
        <div className="space-y-3 pb-3">
          <div className="min-w-0 space-y-2">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {title}
              </h1>
            </div>

            {meta ? (
              <div className="flex min-w-0 items-center gap-2 text-xs">
                {meta}
              </div>
            ) : null}

            {summary ? (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {summary}
              </div>
            ) : null}

            {actions ? (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 sm:gap-2">
                {actions}
              </div>
            ) : null}
          </div>
        </div>

        {children ? (
          <div className="-mx-4 bg-linear-to-b from-transparent to-[#0b1118]/24 px-4 pt-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
