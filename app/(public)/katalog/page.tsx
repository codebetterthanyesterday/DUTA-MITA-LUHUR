import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { CatalogExplorer } from "@/components/catalog/catalog-explorer";
import { Editable } from "@/components/admin/editable";
import { SeoEditButton } from "@/components/admin/seo-edit-button";
import { getBlock, getBlocks } from "@/lib/content/get-blocks";
import { getBlockFormSpec } from "@/lib/content/blocks";
import { buildMetadata } from "@/lib/content/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getBlock("seo.katalog"));
}

export default async function KatalogPage() {
  const [categories, products, content] = await Promise.all([
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
    getBlocks(["katalog.header", "seo.katalog"]),
  ]);

  const serializedProducts = products.map((product) => ({
    ...product,
    moqValue: product.moqValue.toString(), // Serialize Prisma Decimal to string
  }));

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-space-4 md:px-space-6 py-space-8 md:py-space-12">
        <Editable
          spec={getBlockFormSpec("katalog.header")}
          data={content["katalog.header"]}
          label="Edit Header"
        >
          <header className="mb-space-8">
            <h1 className="font-display font-medium text-display-lg text-navy-deep">
              {content["katalog.header"].title}
            </h1>
            <p className="font-body text-body-md text-slate mt-space-2 max-w-2xl">
              {content["katalog.header"].description}
            </p>
          </header>
        </Editable>

        <CatalogExplorer categories={categories} products={serializedProducts} />

        <SeoEditButton spec={getBlockFormSpec("seo.katalog")} data={content["seo.katalog"]} />
      </div>
    </div>
  );
}
