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
    "bg-[linear-gradient(115deg,rgba(52,211,153,0.17)_0%,transparent_40%),linear-gradient(250deg,rgba(14,165,233,0.12)_0%,transparent_46%)]",
  league:
    "bg-[linear-gradient(115deg,rgba(34,197,94,0.27)_0%,transparent_42%),linear-gradient(250deg,rgba(20,184,166,0.18)_0%,transparent_48%)]",
  tournament:
    "bg-[linear-gradient(115deg,rgba(52,211,153,0.24)_0%,transparent_42%),linear-gradient(250deg,rgba(45,212,191,0.16)_0%,transparent_48%),linear-gradient(20deg,rgba(245,208,122,0.07)_0%,transparent_38%)]",
  club: "bg-[linear-gradient(115deg,rgba(96,165,250,0.25)_0%,transparent_42%),linear-gradient(250deg,rgba(52,211,153,0.15)_0%,transparent_48%)]",
  player:
    "bg-[linear-gradient(115deg,rgba(168,85,247,0.24)_0%,transparent_42%),linear-gradient(250deg,rgba(52,211,153,0.14)_0%,transparent_48%)]",
};

const courtLineClassNames: Record<HeaderSurfaceVariant, string> = {
  default:
    "bg-[linear-gradient(120deg,transparent_0%,transparent_22%,rgba(255,255,255,0.075)_22.2%,transparent_22.7%,transparent_56%,rgba(255,255,255,0.055)_56.2%,transparent_56.7%)]",
  league:
    "bg-[linear-gradient(120deg,transparent_0%,transparent_22%,rgba(52,211,153,0.15)_22.2%,transparent_22.7%,transparent_56%,rgba(255,255,255,0.06)_56.2%,transparent_56.7%)]",
  tournament:
    "bg-[linear-gradient(120deg,transparent_0%,transparent_21%,rgba(52,211,153,0.12)_21.2%,transparent_21.8%,transparent_55%,rgba(245,208,122,0.075)_55.2%,transparent_55.8%)]",
  club: "bg-[linear-gradient(120deg,transparent_0%,transparent_22%,rgba(96,165,250,0.15)_22.2%,transparent_22.7%,transparent_56%,rgba(52,211,153,0.07)_56.2%,transparent_56.7%)]",
  player:
    "bg-[linear-gradient(120deg,transparent_0%,transparent_22%,rgba(168,85,247,0.15)_22.2%,transparent_22.7%,transparent_56%,rgba(52,211,153,0.065)_56.2%,transparent_56.7%)]",
};

const premiumSweepClassNames: Record<HeaderSurfaceVariant, string> = {
  default:
    "bg-[linear-gradient(105deg,transparent_0%,transparent_54%,rgba(255,255,255,0.045)_64%,transparent_74%)]",
  league:
    "bg-[linear-gradient(105deg,transparent_0%,transparent_54%,rgba(52,211,153,0.065)_64%,transparent_74%)]",
  tournament:
    "bg-[linear-gradient(105deg,transparent_0%,transparent_52%,rgba(52,211,153,0.075)_62%,rgba(245,208,122,0.035)_68%,transparent_78%)]",
  club: "bg-[linear-gradient(105deg,transparent_0%,transparent_54%,rgba(96,165,250,0.065)_64%,transparent_74%)]",
  player:
    "bg-[linear-gradient(105deg,transparent_0%,transparent_54%,rgba(168,85,247,0.065)_64%,transparent_74%)]",
};

const courtMarkingClassNames: Record<HeaderSurfaceVariant, string> = {
  default:
    "border-white/22 bg-white/4 text-white/32 shadow-[0_0_70px_rgba(255,255,255,0.055)]",
  league:
    "border-emerald-100/28 bg-emerald-400/10 text-emerald-50/46 shadow-[0_0_90px_rgba(52,211,153,0.16)]",
  tournament:
    "border-emerald-100/18 bg-emerald-400/10 text-emerald-50/42 shadow-[0_0_90px_rgba(52,211,153,0.15)]",
  club: "border-sky-100/28 bg-sky-400/10 text-sky-50/46 shadow-[0_0_90px_rgba(96,165,250,0.16)]",
  player:
    "border-violet-100/28 bg-violet-400/10 text-violet-50/46 shadow-[0_0_90px_rgba(168,85,247,0.16)]",
};

function BadmintonCourtMarking({ variant }: { variant: HeaderSurfaceVariant }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -right-52 top-1 h-36 w-96 rotate-[-9deg] opacity-40 sm:-right-52 sm:top-0 sm:h-44 sm:w-96 sm:opacity-60",
        courtMarkingClassNames[variant],
      )}
    >
      {/* Outer court boundary */}
      <span className="absolute inset-x-0 top-0 h-px bg-current" />
      <span className="absolute inset-x-0 bottom-0 h-px bg-current" />
      <span className="absolute inset-y-0 left-0 w-px bg-current" />
      <span className="absolute inset-y-0 right-0 w-px bg-current" />

      {/* Back boundary / tramline pair */}
      <span className="absolute inset-x-0 top-[9%] h-px bg-current opacity-90" />
      <span className="absolute inset-x-0 bottom-[9%] h-px bg-current opacity-90" />

      {/* Side tramlines */}
      <span className="absolute inset-y-0 left-[7%] w-px bg-current opacity-90" />
      <span className="absolute inset-y-0 right-[7%] w-px bg-current opacity-90" />

      {/* Dashed net line */}
      <span className="absolute top-0 bottom-0 left-[42%] border-l border-dashed border-current opacity-75" />

      {/* Short service lines beside the net */}
      <span className="absolute inset-y-[9%] right-[33%] w-px bg-current opacity-85" />

      {/* Centre service line - touches left edge and stops at left divider */}
      <span className="absolute left-0 right-[70%] top-1/2 h-px bg-current opacity-85" />

      {/* Service box vertical dividers */}
      <span className="absolute top-0 bottom-0 left-[30%] w-px bg-current opacity-65" />
      <span className="absolute top-0 bottom-0 right-[31%] border-l border-dashed border-current opacity-65" />
    </div>
  );
}

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
        className={cn(
          "pointer-events-none absolute inset-0 opacity-70 sm:opacity-55",
          courtLineClassNames[variant],
        )}
      />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 opacity-70",
          premiumSweepClassNames[variant],
        )}
      />

      <BadmintonCourtMarking variant={variant} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-4/5 bg-linear-to-r from-[#0b1118]/48 via-[#0b1118]/20 to-transparent sm:w-2/3 sm:from-[#0b1118]/34 sm:via-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent via-[#0b1118]/10 to-[#0b1118]/44"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/14 to-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/22 to-transparent"
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
