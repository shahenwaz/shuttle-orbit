"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/players", label: "Players" },
  { href: "/leaderboard", label: "Leaderboard" },
];

function isLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/8 bg-background/92 supports-backdrop-filter:bg-background/78 supports-backdrop-filter:backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

        <PageContainer className="py-0">
          <div className="relative flex h-16 items-center justify-between gap-3 sm:h-18">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="group flex min-w-0 items-center gap-3"
            >
              <Image
                src="/brand/shuttlerank-logo.webp"
                alt="ShuttleRank logo"
                width={34}
                height={34}
                priority
                className="relative h-8 w-8 object-contain drop-shadow-[0_0_12px_rgba(74,222,128,0.28)] transition duration-300 group-hover:scale-110 sm:h-8.5 sm:w-8.5"
              />

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-primary/75">
                  Badminton Platform
                </p>
                <h1 className="truncate font-heading text-sm font-semibold tracking-tight text-foreground sm:text-base">
                  ShuttleRank
                </h1>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navLinks.map((link) => {
                const active = isLinkActive(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "border-white/10 bg-white/6 text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                        : "border-transparent text-muted-foreground hover:border-white/8 hover:bg-white/4 hover:text-foreground",
                    )}
                  >
                    <span className="relative z-10">{link.label}</span>

                    {active ? (
                      <span className="absolute inset-x-3 bottom-0 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <div className="relative md:hidden">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={mobileMenuOpen}
                className="h-10 w-10 rounded-2xl border border-white/8 bg-white/4 text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.22)] hover:bg-white/8"
              >
                {mobileMenuOpen ? (
                  <X className="h-4.5 w-4.5" />
                ) : (
                  <Menu className="h-4.5 w-4.5" />
                )}
              </Button>

              <div
                className={cn(
                  "absolute right-0 top-[calc(100%+0.75rem)] z-50 w-56 origin-top-right transition-all duration-200",
                  mobileMenuOpen
                    ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-y-2 scale-95 opacity-0",
                )}
              >
                <div className="overflow-hidden rounded-3xl border border-white/8 bg-background shadow-[0_24px_70px_rgba(0,0,0,0.42)] ring-1 ring-white/5 supports-backdrop-filter:backdrop-blur-xl">
                  <div className="pointer-events-none h-px bg-linear-to-r from-transparent via-primary/35 to-transparent" />

                  <nav className="p-2.5">
                    <div className="grid gap-1">
                      {navLinks.map((link) => {
                        const active = isLinkActive(pathname, link.href);

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                              active
                                ? "border border-white/8 bg-primary/10 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                                : "border border-transparent text-muted-foreground hover:bg-white/4 hover:text-foreground",
                            )}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </header>

      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}
    </>
  );
}
