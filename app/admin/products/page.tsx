import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductTable } from "./product-table";
import { PageHeader } from "@/components/admin/ui/page-header";
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
    <div className="p-space-4 md:p-space-8 max-w-6xl mx-auto">
      <PageHeader
        title="Produk"
        description="Kelola daftar produk, spesifikasi, dan gambar."
        actions={
          <Link
            href="products/new"
            className="inline-flex items-center gap-1.5 px-space-4 py-2.5 min-h-[44px] rounded-radius-md font-body font-medium text-body-sm bg-red-signal text-ivory hover:bg-red-signal/90 transition-colors shadow-sm active:scale-[0.98] duration-150"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Tambah Produk
          </Link>
        }
      />

      <ProductTable products={products} categories={categoriesData} />
    </div>
  );
}
