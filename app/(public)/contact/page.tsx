import type { Metadata } from "next";
import { Camera, Mail, MapPin, MessageCircle } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact the badminton tournament organizers for updates, corrections, ranking questions, player information requests, or community event support.",
});

const contactItems = [
  {
    title: "Email",
    value: "kmuzahid52@gmail.com",
    icon: Mail,
    href: "mailto:kmuzahid52@gmail.com",
  },
  {
    title: "Facebook",
    value: "facebook.com/muzahid",
    icon: MessageCircle,
    href: "https://www.facebook.com/user.muzahid",
  },
  {
    title: "Instagram",
    value: "instagram.com/ig_muzahid",
    icon: Camera,
    href: "https://www.instagram.com/ig_muzahid?igsh=MTJocTZ1dHNmM3BsZQ==",
  },
  {
    title: "Location",
    value: "Dublin, Ireland",
    icon: MapPin,
    href: null,
  },
];

export default function ContactPage() {
  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <PublicPageHeader
        eyebrow="Contact"
        title="Contact Us"
        description="Reach out to the tournament organizers for corrections, ranking questions, player information updates, or general event support."
      />

      <section className="rounded-md border border-white/10 bg-white/4 p-4 sm:p-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Get in touch
            </h2>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              Use the contact details below if you need help with tournament
              information, player record updates, match result corrections,
              leaderboard questions, or general community event support.
            </p>
          </div>

          <div className="grid gap-3">
            {contactItems.map((item) => {
              const Icon = item.icon;

              const content = (
                <div className="rounded-md border border-white/10 bg-background/40 p-3.5 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/4">
                      <Icon className="h-4.5 w-4.5 text-primary" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                        {item.title}
                      </p>
                      <p className="wrap-break-word text-sm font-medium text-foreground sm:text-base">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              );

              if (!item.href) {
                return <div key={item.title}>{content}</div>;
              }

              return (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block transition hover:opacity-95"
                >
                  {content}
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
