import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "ShuttleRank",
    template: "%s | ShuttleRank",
  },
  description:
    "ShuttleRank helps communities run badminton tournaments, manage fixtures, track standings, publish results, and build player rankings.",
  applicationName: "ShuttleRank",
  appleWebApp: {
    title: "ShuttleRank",
    capable: true,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "ShuttleRank",
    description:
      "A modern badminton tournament and ranking platform for community competitions.",
    siteName: "ShuttleRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShuttleRank",
    description:
      "Run badminton tournaments, track results, and build player rankings with ShuttleRank.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} dark`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
