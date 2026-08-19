import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";

export type FeaturedProduct = {
  id: string;
  category: string;
  name: string;
  moq: string;
  packaging: string;
};

// TODO: replace with Prisma query once PBI-07/14 (product database) is implemented
const featuredProducts: FeaturedProduct[] = [
  {
    id: "prod-sir-20",
    category: "CRUMB RUBBER",
    name: "SIR 20 (Standard Indonesian Rubber)",
    moq: "20 MT (1 FCL)",
    packaging: "35 kg bale / pallet",
  },
  {
    id: "prod-sir-10",
    category: "CRUMB RUBBER",
    name: "SIR 10 (Low Dirt Grade)",
    moq: "20 MT (1 FCL)",
    packaging: "35 kg bale / pallet",
  },
  {
    id: "prod-rss-1",
    category: "SMOKED SHEET",
    name: "RSS 1 (Ribbed Smoked Sheet)",
    moq: "19.2 MT",
    packaging: "111.11 kg bale / wrap",
  },
  {
    id: "prod-rss-3",
    category: "SMOKED SHEET",
    name: "RSS 3 (Standard Industrial Grade)",
    moq: "19.2 MT",
    packaging: "111.11 kg bale / pallet",
  },
  {
    id: "prod-ha-latex",
    category: "CENTRIFUGED LATEX",
    name: "High Ammonia Latex 60% DRC",
    moq: "16 MT (Flexibag)",
    packaging: "Flexibag / 205 kg drums",
  },
  {
    id: "prod-la-latex",
    category: "CENTRIFUGED LATEX",
    name: "Low Ammonia Latex (LATZ)",
    moq: "16 MT (Flexibag)",
    packaging: "205 kg drums / IBC Tote",
  },
];

export function FeaturedProducts() {
  return (
    <section className="bg-ivory py-space-8 px-space-4 md:px-space-6 border-b border-border-hairline">
      <div className="max-w-7xl mx-auto space-y-space-6">
        <div>
          <span className="font-mono text-caption uppercase tracking-wider text-slate block mb-space-1">
            Katalog Ekspor
          </span>
          <h2 className="font-display font-medium text-display-lg text-navy-deep">
            Produk Unggulan
          </h2>
          <p className="font-body text-body-md text-slate mt-space-1">
            Spesifikasi polimer karet alam dan olahan siap ekspor dengan parameter kualitas terverifikasi.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-3">
          {featuredProducts.map((product) => {
            // Adapter mapping from legacy FeaturedProduct to ProductCardData
            const mappedProduct = {
              id: product.id,
              slug: product.id,
              name: product.name,
              moqValue: product.moq,
              moqUnit: "",
              packaging: product.packaging,
              category: { name: product.category },
              images: [],
            };
            return <ProductCard key={product.id} product={mappedProduct} />;
          })}
        </div>

        {/* Bottom Link Button */}
        <div className="text-center pt-space-3">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-space-1 font-body font-medium text-body-md text-navy-deep hover:text-red-signal transition-colors"
          >
            Lihat Semua Produk →
          </Link>
        </div>
      </div>
    </section>
  );
}
