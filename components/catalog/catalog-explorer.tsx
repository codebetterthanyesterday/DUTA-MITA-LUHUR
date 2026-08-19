"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductCard, ProductCardData } from "@/components/product/product-card";

type Category = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
};

type CatalogExplorerProps = {
  categories: Category[];
  products: ProductCardData[];
};

export function CatalogExplorer({ categories, products }: CatalogExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    searchParams.get("category") || "all"
  );

  // Debounce URL updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (searchTerm) {
        current.set("q", searchTerm);
      } else {
        current.delete("q");
      }

      if (selectedCategoryId !== "all") {
        current.set("category", selectedCategoryId);
      } else {
        current.delete("category");
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      
      // Only push to router if the URL actually changed to prevent infinite loops
      if (search !== searchParams.toString()) {
        router.replace(`${pathname}${query}`, { scroll: false });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategoryId, pathname, router, searchParams]);

  // Real-time filtering (in-memory)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategoryId === "all" || product.categoryId === selectedCategoryId || product.category?.name === categories.find(c => c.id === selectedCategoryId)?.name;

      // 2. Search match
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchLower ||
        product.name.toLowerCase().includes(searchLower) ||
        product.shortDescription?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category.name.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategoryId, categories]);

  const hasActiveFilters = searchTerm !== "" || selectedCategoryId !== "all";

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategoryId("all");
  };

  return (
    <div className="space-y-space-6">
      {/* Search Input */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-space-3 flex items-center pointer-events-none text-slate">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama produk..."
          aria-label="Cari produk"
          className="w-full bg-white border border-border-default rounded-radius-sm py-2 pl-10 pr-4 text-navy-deep focus:outline-none focus:ring-1 focus:ring-navy-deep focus:border-navy-deep transition-colors font-body text-body-md"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-space-2">
        <button
          onClick={() => setSelectedCategoryId("all")}
          aria-pressed={selectedCategoryId === "all"}
          className={`px-4 py-1.5 rounded-radius-sm font-body text-body-sm font-medium transition-colors ${
            selectedCategoryId === "all"
              ? "bg-navy-deep text-ivory"
              : "bg-transparent border border-slate/30 text-slate hover:bg-slate/5"
          }`}
        >
          Semua Produk
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            aria-pressed={selectedCategoryId === cat.id}
            className={`px-4 py-1.5 rounded-radius-sm font-body text-body-sm font-medium transition-colors ${
              selectedCategoryId === cat.id
                ? "bg-navy-deep text-ivory"
                : "bg-transparent border border-slate/30 text-slate hover:bg-slate/5"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Result Count & Inline Reset */}
      <div className="flex items-center gap-space-3">
        <div aria-live="polite" className="font-body text-body-sm text-slate">
          Menampilkan {filteredProducts.length} dari {products.length} produk
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="font-body text-body-sm text-red-signal hover:underline"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="transition-opacity duration-150 ease-in-out opacity-0 animate-[fadeIn_150ms_ease-in-out_forwards]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-space-12 text-center bg-white border border-border-hairline rounded-radius-md">
          <p className="font-body text-body-md text-slate mb-space-4">
            Tidak ada produk yang cocok dengan pencarian Anda.
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center px-space-4 py-2 bg-navy-deep text-ivory rounded-radius-sm hover:bg-navy-base transition-colors font-body text-body-md font-medium"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
