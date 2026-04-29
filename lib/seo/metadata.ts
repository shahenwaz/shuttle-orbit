import type { Metadata } from "next";

type BuildPageMetadataArgs = {
  title: string;
  description: string;
};

export function buildPageMetadata({
  title,
  description,
}: BuildPageMetadataArgs): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
