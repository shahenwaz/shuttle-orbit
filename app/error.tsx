"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageContainer className="flex min-h-[68vh] items-center justify-center py-10">
      <section className="w-full max-w-xl rounded-md border border-white/10 bg-white/4 p-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-7">
        <div className="space-y-4">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-md border border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-300" />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-300/90">
              Unexpected error
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Something went wrong
            </h1>
            <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              We could not complete this request. Please try again or return in
              a moment.
            </p>
          </div>

          {error?.message ? (
            <div className="rounded-md border border-white/10 bg-background/50 px-3 py-2 text-left text-xs text-muted-foreground">
              {error.message}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => reset()}
              className={actionPillButtonClassName({
                variant: "danger",
                className: "gap-1.5 text-xs sm:text-sm",
              })}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
