import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { redirect, notFound } from "next/navigation";

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
    <div className="p-space-6 md:p-space-10 max-w-6xl mx-auto">
      <div className="mb-space-6">
        <h1 className="font-display font-medium text-display-lg text-navy-deep">
          Edit Produk: {product.name}
        </h1>
        <p className="font-body text-body-sm text-slate mt-space-1">
          Perbarui informasi produk di bawah ini.
        </p>
      </div>

      <ProductForm 
        categories={categories} 
        initialProduct={initialProduct}
        backUrl="../../" // relative path back to /admin/products from /admin/products/[id]/edit
      />
    </div>
  );
}
