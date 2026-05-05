import Image from "next/image";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Tournaments", href: "/tournaments" },
      { label: "Players", href: "/players" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-background/70">
      <PageContainer className="py-8 sm:py-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <Link href="/" className="group inline-flex items-center gap-3">
            <Image
              src="/brand/shuttle-orbit-logo.webp"
              alt="Shuttle Orbit logo"
              width={32}
              height={32}
              className="relative h-7.5 w-7.5 object-contain drop-shadow-[0_0_10px_rgba(74,222,128,0.24)] transition duration-300 group-hover:scale-105"
            />

            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/80">
                Badminton platform
              </p>
              <p className="font-heading text-sm font-semibold text-foreground sm:text-base">
                Shuttle Orbit
              </p>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-6 sm:gap-8">
            {footerGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/85">
                  {group.title}
                </h2>

                <nav className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4">
          <p className="text-xs text-muted-foreground sm:text-sm">
            © {new Date().getFullYear()} Shuttle Orbit. Built for community
            badminton tournaments, results, and rankings.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
