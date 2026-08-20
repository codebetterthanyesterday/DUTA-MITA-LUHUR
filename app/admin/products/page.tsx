import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ProductTable } from "./product-table";
import { redirect } from "next/navigation";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin");
  }

  const [productsData, categoriesData] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        _count: {
          select: { rfqs: true },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const products = productsData.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    categoryId: p.categoryId,
    categoryName: p.category.name,
    isActive: p.isActive,
    rfqCount: p._count.rfqs,
  }));

  return (
    <div className="p-space-6 md:p-space-10 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-4 border-b border-slate/20 pb-space-4 mb-space-6">
        <div>
          <h1 className="font-display font-medium text-display-lg text-navy-deep">
            Produk
          </h1>
          <p className="font-body text-body-sm text-slate mt-space-1">
            Kelola daftar produk, spesifikasi, dan gambar.
          </p>
        </div>
        <div>
          <Link
            href="products/new"
            className="inline-flex items-center px-space-4 py-space-2 rounded-radius-sm font-body font-medium text-body-sm bg-red-signal text-ivory hover:bg-red-signal/90 transition-colors"
          >
            + Tambah Produk
          </Link>
        </div>
      </div>

      <ProductTable products={products} categories={categoriesData} />
    </div>
  );
}
