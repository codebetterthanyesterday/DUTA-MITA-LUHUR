import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { PageHeader } from "@/components/admin/ui/page-header";
import { notFound } from "next/navigation";
import { getAdminRoute } from "@/lib/admin-routes";

export default async function EditCategoryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin");
  }

  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="p-space-4 md:p-space-8 max-w-2xl mx-auto">
      <PageHeader
        title={`Edit Kategori: ${category.name}`}
        backHref={getAdminRoute("categories")}
        backLabel="Kembali ke Kategori"
      />

      <CategoryForm initialData={category} backUrl={getAdminRoute("categories")} />
    </div>
  );
}
