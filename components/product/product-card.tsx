"use client";

import { useState } from "react";
import Link from "next/link";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  moqValue: number | string | { toString(): string };
  moqUnit: string;
  packaging: string;
  category: {
    name: string;
  };
  images: {
    url: string;
    altText: string;
  }[];
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const [imageError, setImageError] = useState(false);
  const primaryImage = product.images?.[0];

  // Safely format MOQ value
  const moqFormatted =
    typeof product.moqValue === "object" && product.moqValue !== null
      ? product.moqValue.toString()
      : String(product.moqValue);

  return (
    <Link
      href="/katalog" // TODO: update to /katalog/${product.slug} once PBI-09 exists
      className="bg-ivory border border-border-hairline rounded-radius-md shadow-card hover:shadow-card-hover hover:-translate-y-[3px] transition-all duration-200 p-space-3 flex flex-col justify-between group h-full"
    >
      <div>
        {/* Image Area */}
        <div className="aspect-[4/3] bg-navy-base/5 border border-border-hairline rounded-radius-sm mb-space-3 group-hover:bg-navy-base/10 transition-colors relative overflow-hidden flex flex-col items-center justify-center">
          {primaryImage && !imageError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-space-2 text-center w-full h-full">
              <span className="font-mono text-caption uppercase text-slate/70">
                Spesimen Produk
              </span>
              <span className="font-mono text-caption text-slate/50 mt-0.5">
                {product.category.name}
              </span>
            </div>
          )}
        </div>

        <span className="font-mono text-caption text-red-signal font-medium uppercase tracking-wider block">
          {product.category.name}
        </span>

        <h3 className="font-display font-medium text-display-md text-navy-deep mt-space-1 group-hover:text-red-signal transition-colors">
          {product.name}
        </h3>
      </div>

      <div className="pt-space-3 mt-space-2 border-t border-border-hairline">
        <p className="font-body text-body-sm text-slate">
          MOQ {moqFormatted} {product.moqUnit} &middot; {product.packaging}
        </p>
      </div>
    </Link>
  );
}
