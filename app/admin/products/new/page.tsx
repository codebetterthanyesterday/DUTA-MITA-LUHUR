import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/ui/page-header";
import { redirect } from "next/navigation";
import { getAdminRoute } from "@/lib/admin-routes";

export default async function NewProductPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin");
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="p-space-4 md:p-space-8 max-w-6xl mx-auto">
      <PageHeader
        title="Tambah Produk Baru"
        description="Lengkapi form di bawah ini untuk menambahkan produk ke katalog."
        backHref={getAdminRoute("products")}
        backLabel="Kembali ke Produk"
      />

      <ProductForm
        categories={categories}
        backUrl={getAdminRoute("products")}
      />
    </div>
  );
}
