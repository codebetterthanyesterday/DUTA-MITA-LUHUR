import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { RfqForm } from "@/components/rfq/rfq-form";

export const metadata: Metadata = {
  title: "Ajukan Penawaran (RFQ) — PT Duta Mita Luhur",
  description:
    "Formulir pengajuan Request for Quote (RFQ) untuk produk karet alam (RSS, SIR, Latex) dari PT Duta Mita Luhur.",
};

export default async function RfqPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productSlug } = await searchParams;

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
      <section className="bg-navy-deep text-ivory py-space-8 px-space-4 md:px-space-6 border-b border-slate/20">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="font-mono text-caption text-gold-hairline uppercase tracking-wider mb-space-3">
            AJUKAN PENAWARAN
          </span>
          <h1 className="font-display font-medium text-display-lg text-ivory max-w-4xl leading-tight">
            Request for Quote (RFQ)
          </h1>
          <p className="font-body text-body-lg text-ivory/80 max-w-2xl mt-space-3">
            Dapatkan penawaran harga terbaik dan informasi ketersediaan stok untuk kebutuhan industri Anda.
          </p>
        </div>
      </section>

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
          <RfqForm 
            products={productsForSelect} 
            initialSelectedIds={initialSelectedIds} 
          />
        </div>
      </section>
    </main>
  );
}
