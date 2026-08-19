import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getProductBySlug } from "@/lib/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCard } from "@/components/product/product-card";

export const revalidate = 3600; // 1 hour ISR

// Pre-render all active product slugs at build time
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan | Duta Mita Luhur",
    };
  }

  return {
    title: `${product.name} | Duta Mita Luhur`,
    description: product.shortDescription || undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product || !product.isActive) {
    notFound();
  }

  // Fetch related products in the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: {
      category: true,
      images: { where: { isPrimary: true }, take: 1 },
    },
    take: 3,
  });

  // Safe formatting for MOQ Decimal to string
  const moqFormatted =
    typeof product.moqValue === "object" && product.moqValue !== null
      ? product.moqValue.toString()
      : String(product.moqValue);

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-space-4 md:px-space-6 py-space-6 md:py-space-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="font-body text-body-sm text-slate mb-space-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-navy-deep transition-colors">Beranda</Link>
            </li>
            <li className="text-slate/40">/</li>
            <li>
              <Link href="/katalog" className="hover:text-navy-deep transition-colors">Katalog Produk</Link>
            </li>
            <li className="text-slate/40">/</li>
            <li>
              <Link href={`/katalog?category=${product.categoryId}`} className="hover:text-navy-deep transition-colors">
                {product.category.name}
              </Link>
            </li>
            <li className="text-slate/40">/</li>
            <li aria-current="page" className="text-navy-deep font-medium truncate">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* 2-Column Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-space-6 lg:gap-space-8 mb-space-12">
          
          {/* Left Column: Image Gallery */}
          <div className="min-w-0">
            <ProductGallery 
              images={product.images} 
              productName={product.name} 
              categoryName={product.category.name} 
            />
          </div>

          {/* Right Column: Sticky Info Panel */}
          <div>
            <div className="lg:sticky lg:top-24 space-y-space-4">
              
              <Link 
                href={`/katalog?category=${product.categoryId}`}
                className="font-mono text-caption text-red-signal uppercase tracking-wider hover:underline block"
              >
                {product.category.name}
              </Link>
              
              <h1 className="font-display font-medium text-display-lg text-navy-deep">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="font-body text-body-lg text-slate">
                  {product.shortDescription}
                </p>
              )}

              {/* Stat Block */}
              <div className="grid grid-cols-2 divide-x divide-slate/20 border border-slate/20 rounded-radius-md bg-white mt-space-6 mb-space-6">
                <div className="p-space-3 flex flex-col">
                  <span className="font-body text-caption text-slate uppercase">MOQ</span>
                  <span className="font-mono text-body-md text-navy-deep font-medium mt-0.5">
                    {moqFormatted} {product.moqUnit}
                  </span>
                </div>
                <div className="p-space-3 flex flex-col">
                  <span className="font-body text-caption text-slate uppercase">Kemasan</span>
                  <span className="font-mono text-body-md text-navy-deep font-medium mt-0.5">
                    {product.packaging}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-space-3 pt-space-2">
                <Link
                  href={`/kontak?product=${product.slug}`} // TODO: prefill RFQ form with this product once PBI-11 exists
                  className="block w-full text-center bg-red-signal hover:bg-red-signal/90 text-ivory py-space-3 rounded-radius-sm font-body font-medium text-body-lg transition-colors shadow-card hover:shadow-card-hover"
                >
                  Ajukan Penawaran untuk Produk Ini
                </Link>
                
                <a
                  href="https://wa.me/62XXXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-space-2 w-full text-slate hover:text-navy-deep py-2 font-body font-medium text-body-sm transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814h.005c3.18 0 5.767-2.586 5.768-5.766 0-1.54-.6-2.987-1.689-4.078-1.09-1.089-2.538-1.722-4.084-1.722zm0-2.172c2.094 0 4.062.815 5.542 2.296 1.48 1.48 2.296 3.448 2.296 5.543 0 4.322-3.518 7.84-7.839 7.84-1.328 0-2.614-.337-3.754-.977l-4.276 1.121 1.141-4.172c-.703-1.189-1.074-2.551-1.073-3.947.001-4.321 3.518-7.839 7.84-7.839zm0 13.914c1.157 0 2.29-.311 3.279-.899l.235-.14 2.438.64-.651-2.376.153-.244c.646-1.028.987-2.222.987-3.454-.001-3.328-2.709-6.036-6.038-6.036-1.613 0-3.129.628-4.27 1.769-1.141 1.141-1.769 2.658-1.769 4.271 0 3.329 2.708 6.037 6.037 6.037z" />
                  </svg>
                  <span>Chat dengan Sales Representative via WhatsApp</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Full Description Section */}
        {product.description && (
          <section className="mb-space-12 pt-space-8 border-t border-border-hairline">
            <h2 className="font-display font-medium text-display-md text-navy-deep mb-space-4">
              Deskripsi Produk
            </h2>
            <div className="font-body text-body-md text-slate leading-relaxed max-w-[65ch]">
              {product.description.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-space-3">{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {/* Technical Specifications Section */}
        {product.specifications.length > 0 && (
          <section className="mb-space-12 pt-space-8 border-t border-border-hairline">
            <h2 className="font-display font-medium text-display-md text-navy-deep mb-space-4">
              Spesifikasi Teknis
            </h2>
            <div className="max-w-3xl">
              <dl className="divide-y divide-border-hairline border-t border-b border-border-hairline">
                {product.specifications.map((spec) => (
                  <div key={spec.id} className="grid grid-cols-1 sm:grid-cols-3 py-space-3 gap-1 sm:gap-4">
                    <dt className="font-mono text-caption text-slate uppercase sm:pt-1">
                      {spec.label}
                    </dt>
                    <dd className="font-body text-body-md text-navy-deep sm:col-span-2">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="pt-space-8 border-t border-border-hairline">
            <h2 className="font-display font-medium text-display-md text-navy-deep mb-space-6">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-3">
              {relatedProducts.map((related) => {
                // Adapter mapping to serialize Decimal
                const mappedProduct = {
                  ...related,
                  moqValue: typeof related.moqValue === "object" && related.moqValue !== null
                    ? related.moqValue.toString()
                    : String(related.moqValue)
                };
                return <ProductCard key={related.id} product={mappedProduct} />;
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
