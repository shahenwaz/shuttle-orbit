"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/clubs", label: "Clubs" },
  { href: "/players", label: "Players" },
  { href: "/leaderboard", label: "Leaderboard" },
];

function isLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeaderNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const brandLink = document.querySelector("[data-site-header-brand]");
    const closeMobileMenu = () => setMobileMenuOpen(false);

    brandLink?.addEventListener("click", closeMobileMenu);

    return () => {
      brandLink?.removeEventListener("click", closeMobileMenu);
    };
  }, []);

  return (
    <>
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
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
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

      {mobileMenuOpen
        ? createPortal(
            <button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />,
            document.body,
          )
        : null}
    </>
  );
}
