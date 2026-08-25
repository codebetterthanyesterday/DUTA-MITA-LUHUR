import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustStats } from "@/components/home/trust-stats";
import { WhyUs } from "@/components/home/why-us";
import { FeaturedProducts } from "@/components/home/featured-products";
import { FinalCta } from "@/components/shared/final-cta";
import { Editable } from "@/components/admin/editable";
import { SeoEditButton } from "@/components/admin/seo-edit-button";
import { getBlock, getBlocks } from "@/lib/content/get-blocks";
import { getBlockFormSpec } from "@/lib/content/blocks";
import { buildMetadata } from "@/lib/content/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getBlock("seo.home"));
}

export default async function HomePage() {
  const content = await getBlocks([
    "home.hero",
    "home.trustStats",
    "home.whyUs",
    "home.featuredProducts",
    "home.finalCta",
    "seo.home",
  ]);

  return (
    <main className="min-h-screen bg-ivory text-navy-deep">
      <Editable spec={getBlockFormSpec("home.hero")} data={content["home.hero"]} label="Edit Hero">
        <Hero content={content["home.hero"]} />
      </Editable>

      <Editable
        spec={getBlockFormSpec("home.trustStats")}
        data={content["home.trustStats"]}
        label="Edit Statistik"
      >
        <TrustStats content={content["home.trustStats"]} />
      </Editable>

      <Editable
        spec={getBlockFormSpec("home.whyUs")}
        data={content["home.whyUs"]}
        label="Edit Keunggulan"
      >
        <WhyUs content={content["home.whyUs"]} />
      </Editable>

      <Editable
        spec={getBlockFormSpec("home.featuredProducts")}
        data={content["home.featuredProducts"]}
        label="Edit Bagian Produk"
      >
        <FeaturedProducts content={content["home.featuredProducts"]} />
      </Editable>

      <Editable
        spec={getBlockFormSpec("home.finalCta")}
        data={content["home.finalCta"]}
        label="Edit Ajakan"
      >
        <FinalCta {...content["home.finalCta"]} />
      </Editable>

      <SeoEditButton spec={getBlockFormSpec("seo.home")} data={content["seo.home"]} />
    </main>
  );
}
