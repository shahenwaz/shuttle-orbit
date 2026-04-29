import Link from "next/link";
import { Trophy } from "lucide-react";

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
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/4">
              <Trophy className="h-4.5 w-4.5 text-primary" />
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/80">
                Community platform
              </p>
              <p className="font-heading text-sm font-semibold text-foreground sm:text-base">
                Badminton Tournament Manager
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
            © {new Date().getFullYear()} Badminton Tournament Manager. Built for
            community badminton events.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
