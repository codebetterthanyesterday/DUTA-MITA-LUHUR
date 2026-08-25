import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustStats } from "@/components/home/trust-stats";
import { WhyUs } from "@/components/home/why-us";
import { FeaturedProducts } from "@/components/home/featured-products";
import { FinalCta } from "@/components/home/final-cta";

const title = "DUTA Mitra LUHUR — Produsen & Eksportir Karet Alam Industri Indonesia";
const description = "PT Duta Mitra Luhur memproduksi dan mengekspor polimer karet alam berstandar internasional (SIR 20, SIR 10, RSS, Centrifuged Latex) untuk industri manufaktur global.";

export const metadata: Metadata = {
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ivory text-navy-deep">
      <Hero />
      <TrustStats />
      <WhyUs />
      <FeaturedProducts />
      <FinalCta />
    </main>
  );
}
