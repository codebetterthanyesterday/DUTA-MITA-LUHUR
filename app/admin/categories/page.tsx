import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CategoryTable } from "./category-table";

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
    <div className="p-space-6 md:p-space-10 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-4 border-b border-slate/20 pb-space-4 mb-space-6">
        <div>
          <h1 className="font-display font-medium text-display-lg text-navy-deep">
            Manajemen Kategori
          </h1>
          <p className="font-body text-body-sm text-slate mt-space-1">
            Kelola kategori produk dan urutan tampilannya.
          </p>
        </div>
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}
