import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/ui/page-header";
import { redirect, notFound } from "next/navigation";
import { getAdminRoute } from "@/lib/admin-routes";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user) {
    redirect("/admin");
  }

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        specifications: { orderBy: { sortOrder: 'asc' } },
        images: { orderBy: { sortOrder: 'asc' } },
      }
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  // Cast product decimal fields to proper types expected by the form
  const initialProduct = {
    ...product,
    moqValue: Number(product.moqValue),
  };

  return (
    <div className="p-space-4 md:p-space-8 max-w-6xl mx-auto">
      <PageHeader
        title={`Edit Produk: ${product.name}`}
        description="Perbarui informasi produk di bawah ini."
        backHref={getAdminRoute("products")}
        backLabel="Kembali ke Produk"
      />

      <ProductForm
        categories={categories}
        initialProduct={initialProduct}
        backUrl={getAdminRoute("products")}
      />
    </div>
  );
}
