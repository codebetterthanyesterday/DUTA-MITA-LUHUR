import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { RfqForm } from "@/components/rfq/rfq-form";
import { AdminActionNotice } from "@/components/shared/admin-action-notice";
import { Editable } from "@/components/admin/editable";
import { SeoEditButton } from "@/components/admin/seo-edit-button";
import { getBlock, getBlocks } from "@/lib/content/get-blocks";
import { getBlockFormSpec } from "@/lib/content/blocks";
import { buildMetadata } from "@/lib/content/metadata";
import { isAdminRequest } from "@/lib/auth-helpers";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getBlock("seo.rfq"));
}

export default async function RfqPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productSlug } = await searchParams;

  const [content, isAdmin] = await Promise.all([
    getBlocks(["rfq.header", "seo.rfq"]),
    isAdminRequest(),
  ]);

  // Fetch all active products for the multi-select
  const activeProducts = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      category: { select: { name: true } },
    },
    orderBy: [
      { category: { sortOrder: "asc" } },
      { name: "asc" },
    ],
  });

  const productsForSelect = activeProducts.map(p => ({
    id: p.id,
    name: p.name,
    categoryName: p.category.name,
  }));

  let initialSelectedIds: string[] = [];

  // If there's a product prefill slug, try to look it up
  if (productSlug) {
    const prefillProduct = await prisma.product.findFirst({
      where: { slug: productSlug, isActive: true },
      select: { id: true }
    });
    
    if (prefillProduct) {
      initialSelectedIds = [prefillProduct.id];
    }
  }

  return (
    <main className="min-h-screen bg-ivory text-navy-deep flex flex-col">
      {/* 1. Page Header Band */}
      <Editable
        spec={getBlockFormSpec("rfq.header")}
        data={content["rfq.header"]}
        label="Edit Header"
      >
        <section className="bg-navy-deep text-ivory py-space-8 px-space-4 md:px-space-6 border-b border-slate/20">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <span className="font-mono text-caption text-gold-hairline uppercase tracking-wider mb-space-3">
              {content["rfq.header"].eyebrow}
            </span>
            <h1 className="font-display font-medium text-display-lg text-ivory max-w-4xl leading-tight">
              {content["rfq.header"].title}
            </h1>
            <p className="font-body text-body-lg text-ivory/80 max-w-2xl mt-space-3">
              {content["rfq.header"].subtitle}
            </p>
          </div>
        </section>
      </Editable>

      <SeoEditButton spec={getBlockFormSpec("seo.rfq")} data={content["seo.rfq"]} />

      {/* 2. Form Section */}
      <section className="bg-ivory py-space-12 px-space-4 md:px-space-6 flex-grow">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Trust/reassurance line */}
          <div className="mb-space-8 text-center max-w-2xl">
            <p className="font-body text-body-md text-slate">
              Tim sales representatif kami akan meninjau pengajuan Anda dan menghubungi Anda kembali dengan penawaran detail serta estimasi waktu pengiriman.
            </p>
          </div>

          {/* Form Card */}
          {isAdmin ? (
            <AdminActionNotice action="Pengajuan RFQ" className="w-full max-w-3xl mx-auto" />
          ) : (
            <RfqForm
              products={productsForSelect}
              initialSelectedIds={initialSelectedIds}
            />
          )}
        </div>
      </section>
    </main>
  );
}
