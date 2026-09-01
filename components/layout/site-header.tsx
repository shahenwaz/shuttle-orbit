import Image from "next/image";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { SiteHeaderNavigation } from "@/components/layout/site-header-navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-background/92 supports-backdrop-filter:bg-background/78 supports-backdrop-filter:backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      <PageContainer className="py-0">
        <div className="relative flex h-16 items-center justify-between gap-3 sm:h-18">
          <Link
            href="/"
            data-site-header-brand
            className="group flex min-w-0 items-center gap-3"
          >
            <Image
              src="/brand/shuttle-orbit-logo.webp"
              alt="Shuttle Orbit logo"
              width={34}
              height={34}
              loading="eager"
              fetchPriority="high"
              className="relative h-8 w-8 object-contain drop-shadow-[0_0_12px_rgba(74,222,128,0.28)] transition duration-300 group-hover:scale-110 sm:h-8.5 sm:w-8.5"
            />

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-primary/75">
                Badminton Platform
              </p>
              <p className="truncate font-heading text-sm font-semibold tracking-tight text-foreground sm:text-base">
                Shuttle Orbit
              </p>
            </div>
          </Link>

          <SiteHeaderNavigation />
        </div>
      </PageContainer>
    </header>
  );
}
