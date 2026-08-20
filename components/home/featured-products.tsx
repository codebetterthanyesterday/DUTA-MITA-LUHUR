import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import prisma from "@/lib/prisma";

export async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      images: { where: { isPrimary: true }, take: 1 },
    },
    take: 6,
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
  });

  const serializedProducts = products.map((product) => ({
    ...product,
    moqValue: product.moqValue.toString(), // Serialize Prisma Decimal to string
  }));

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
          {serializedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
