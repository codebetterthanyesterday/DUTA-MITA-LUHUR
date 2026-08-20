import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin");
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="p-space-6 md:p-space-10 max-w-6xl mx-auto">
      <div className="mb-space-6">
        <h1 className="font-display font-medium text-display-lg text-navy-deep">
          Tambah Produk Baru
        </h1>
        <p className="font-body text-body-sm text-slate mt-space-1">
          Lengkapi form di bawah ini untuk menambahkan produk ke katalog.
        </p>
      </div>

      <ProductForm 
        categories={categories} 
        backUrl="../" // relative path back to /admin/products from /admin/products/new
      />
    </div>
  );
}
