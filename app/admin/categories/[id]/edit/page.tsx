import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
  params: { id: string };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin");
  }

  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="p-space-6 md:p-space-10 max-w-4xl mx-auto">
      <div className="mb-space-6">
        <Link
          href="../../categories"
          className="inline-flex items-center gap-2 text-body-sm font-medium text-slate hover:text-navy-deep transition-colors mb-space-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Kembali ke Kategori
        </Link>
        <h1 className="font-display font-medium text-display-md text-navy-deep">
          Edit Kategori: {category.name}
        </h1>
      </div>

      <CategoryForm initialData={category} />
    </div>
  );
}
