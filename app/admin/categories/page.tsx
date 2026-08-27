import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { CategoryTable } from "./category-table";
import { PageHeader } from "@/components/admin/ui/page-header";

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin");
  }

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="p-space-4 md:p-space-8 max-w-5xl mx-auto">
      <PageHeader
        title="Kategori"
        description="Kelola kategori produk dan urutan tampilannya."
        actions={
          <Link
            href="categories/new"
            className="inline-flex items-center gap-1.5 px-space-4 py-2.5 min-h-[44px] rounded-radius-md font-body font-medium text-body-sm bg-red-signal text-ivory hover:bg-red-signal/90 transition-colors shadow-sm active:scale-[0.98] duration-150"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Tambah Kategori
          </Link>
        }
      />

      <CategoryTable categories={categories} />
    </div>
  );
}
