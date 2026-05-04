import Link from "next/link";
import { ArrowRight, CircleAlert } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";

export default function NotFoundPage() {
  return (
    <PageContainer className="flex min-h-[68vh] items-center justify-center py-10">
      <section className="w-full max-w-xl rounded-md border border-white/10 bg-white/4 p-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-7">
        <div className="space-y-4">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-md border border-red-500/20 bg-red-500/10">
            <CircleAlert className="h-5 w-5 text-red-300" />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-300/90">
              Error 404
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Page not found
            </h1>
            <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              The page you are looking for does not exist, may have moved, or is
              not available right now.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <Link
              href="/"
              className={actionPillButtonClassName({
                variant: "neutral",
                className: "gap-1.5 text-xs sm:text-sm",
              })}
            >
              Go home
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/tournaments"
              className={actionPillButtonClassName({
                variant: "link",
                className: "text-xs sm:text-sm",
              })}
            >
              Browse tournaments
            </Link>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
