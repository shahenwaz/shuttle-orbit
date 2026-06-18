import type { ReactNode } from "react";

import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";

type AdminDetailHeaderVariant =
  | "default"
  | "league"
  | "tournament"
  | "club"
  | "player";

type AdminDetailHeaderProps = {
  title: string;
  actions?: ReactNode;
  meta?: ReactNode;
  summary?: ReactNode;
  children?: ReactNode;
  variant?: AdminDetailHeaderVariant;
};

const variantClassNames: Record<AdminDetailHeaderVariant, string> = {
  default: "bg-[linear-gradient(135deg,#101923_0%,#0f1b22_48%,#0b1118_100%)]",

  // Old club style → now league
  league: "bg-[linear-gradient(135deg,#0f1b16_0%,#10261c_46%,#0b1118_100%)]",

  // Old league style → now tournament
  tournament:
    "bg-[linear-gradient(135deg,#101923_0%,#10231d_46%,#0c171d_100%)]",

  // Old player style → now club
  club: "bg-[linear-gradient(135deg,#101826_0%,#121f31_46%,#0b1118_100%)]",

  // Old ranking style → now player
  player: "bg-[linear-gradient(135deg,#11151f_0%,#17172a_46%,#0b1118_100%)]",
};

const accentClassNames: Record<AdminDetailHeaderVariant, string> = {
  default:
    "bg-[linear-gradient(115deg,rgba(52,211,153,0.1)_0%,transparent_34%),linear-gradient(255deg,rgba(14,165,233,0.07)_0%,transparent_42%)]",

  // League: deeper community emerald
  league:
    "bg-[linear-gradient(115deg,rgba(34,197,94,0.12)_0%,transparent_34%),linear-gradient(255deg,rgba(20,184,166,0.07)_0%,transparent_42%)]",

  // Tournament: premium competition green/teal
  tournament:
    "bg-[linear-gradient(115deg,rgba(52,211,153,0.13)_0%,transparent_34%),linear-gradient(255deg,rgba(45,212,191,0.07)_0%,transparent_42%)]",

  // Club: cooler blue/green identity surface
  club: "bg-[linear-gradient(115deg,rgba(96,165,250,0.1)_0%,transparent_34%),linear-gradient(255deg,rgba(52,211,153,0.06)_0%,transparent_42%)]",

  // Player: purple profile energy, not ranking
  player:
    "bg-[linear-gradient(115deg,rgba(168,85,247,0.1)_0%,transparent_34%),linear-gradient(255deg,rgba(52,211,153,0.06)_0%,transparent_42%)]",
};

export function AdminDetailHeader({
  title,
  actions,
  meta,
  summary,
  children,
  variant = "default",
}: AdminDetailHeaderProps) {
  return (
    <section
      className={[
        "relative -mx-4 overflow-hidden px-4 pt-5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
        variantClassNames[variant],
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0",
          accentClassNames[variant],
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-linear-to-r from-[#0b1118]/28 via-transparent to-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent via-[#0b1118]/8 to-[#0b1118]/38"
      />

      <div className="relative">
        <div className="space-y-3 pb-3">
          <AdminShellHeader title={title} actions={actions} />

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
