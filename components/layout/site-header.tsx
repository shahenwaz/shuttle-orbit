import Link from "next/link";
import { Trophy } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/players", label: "Players" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <PageContainer className="py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-sm">
              <Trophy className="h-5 w-5" />
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary/80">
                Community Sports Platform
              </p>
              <h1 className="text-base font-bold sm:text-lg">
                Badminton Tournament Manager
              </h1>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-white/10 hover:bg-white/5 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </PageContainer>
    </header>
  );
}
