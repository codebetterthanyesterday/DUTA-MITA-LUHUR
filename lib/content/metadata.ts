import type { Metadata } from "next";

/**
 * Expand an editable `seo.*` block into the OpenGraph/Twitter metadata shape
 * every public page already used, so editing SEO in one place keeps the social
 * cards and the search snippet in sync.
 */
export function buildMetadata({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
