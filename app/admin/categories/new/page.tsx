import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getAdminRoute } from "@/lib/admin-routes";

export default async function NewCategoryPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin");
  }

  return (
    <div className="p-space-4 md:p-space-8 max-w-2xl mx-auto">
      <PageHeader
        title="Tambah Kategori Baru"
        backHref={getAdminRoute("categories")}
        backLabel="Kembali ke Kategori"
      />

      <CategoryForm backUrl={getAdminRoute("categories")} />
    </div>
  );
}
