import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { CatalogExplorer } from "@/components/catalog/catalog-explorer";

const title = "Katalog Produk | Duta Mitra Luhur";
const description = "Eksplorasi spesifikasi polimer karet alam dan olahan siap ekspor dengan parameter kualitas terverifikasi dari PT Duta Mitra Luhur.";

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

export default async function KatalogPage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
    }),
  ]);

  const serializedProducts = products.map((product) => ({
    ...product,
    moqValue: product.moqValue.toString(), // Serialize Prisma Decimal to string
  }));

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-space-4 md:px-space-6 py-space-8 md:py-space-12">
        <header className="mb-space-8">
          <h1 className="font-display font-medium text-display-lg text-navy-deep">
            Katalog Produk
          </h1>
          <p className="font-body text-body-md text-slate mt-space-2 max-w-2xl">
            Eksplorasi jajaran produk karet alam unggulan kami. Dari Ribbed Smoked Sheet premium hingga Crumb Rubber berstandar internasional, kami memastikan parameter teknis yang ketat untuk setiap kebutuhan industri Anda.
          </p>
        </header>

        <CatalogExplorer categories={categories} products={serializedProducts} />
      </div>
    </div>
  );
}
