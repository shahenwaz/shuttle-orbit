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
    default: "Shuttle Orbit",
    template: "%s | Shuttle Orbit",
  },
  description:
    "Shuttle Orbit helps communities run badminton tournaments, manage fixtures, track standings, publish results, and build player rankings.",
  applicationName: "Shuttle Orbit",
  appleWebApp: {
    title: "Shuttle Orbit",
    capable: true,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Shuttle Orbit",
    description:
      "A modern badminton tournament and ranking platform for community competitions.",
    siteName: "Shuttle Orbit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shuttle Orbit",
    description:
      "Run badminton tournaments, track results, and build player rankings with Shuttle Orbit.",
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
