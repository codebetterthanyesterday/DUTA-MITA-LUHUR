"use client";

import React, { useState, useMemo, useEffect } from "react";

type ProductOption = {
  id: string;
  name: string;
  categoryName: string;
};

interface ProductMultiSelectProps {
  products: ProductOption[];
  initialSelectedIds?: string[];
  disabled?: boolean;
}

export function ProductMultiSelect({
  products,
  initialSelectedIds = [],
  disabled = false,
}: ProductMultiSelectProps) {
  // Validate initialSelectedIds against existing products
  const validInitialIds = useMemo(() => {
    const validIds = new Set(products.map(p => p.id));
    return initialSelectedIds.filter(id => validIds.has(id));
  }, [products, initialSelectedIds]);

  const [selectedIds, setSelectedIds] = useState<string[]>(validInitialIds);
  const [searchTerm, setSearchTerm] = useState("");

  // Re-run validation only if products/initialSelectedIds change explicitly,
  // but typically we rely on the first mount or if props completely reset.
  useEffect(() => {
    const validIds = new Set(products.map(p => p.id));
    const validInitial = initialSelectedIds.filter(id => validIds.has(id));
    // Only update if it's completely different to avoid wiping user state during unrelated re-renders
    // But since this is a controlled initialization, we assume it's stable.
    if (validInitial.length > 0 && selectedIds.length === 0 && searchTerm === "") {
        setSelectedIds(validInitial);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelectedIds, products]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lowerTerm = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerTerm) ||
        p.categoryName.toLowerCase().includes(lowerTerm)
    );
  }, [products, searchTerm]);

  const toggleSelection = (id: string) => {
    if (disabled) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const removeSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const selectedProducts = products.filter(p => selectedIds.includes(p.id));

  return (
    <div className="flex flex-col gap-space-3">
      {/* Hidden input to pass state to server action */}
      <input type="hidden" name="productIds" value={selectedIds.join(",")} />

      {/* Selected Chips */}
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 bg-navy-deep text-ivory rounded-radius-sm px-3 py-1.5 text-body-sm font-body shadow-sm"
            >
              <span>{p.name}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={(e) => removeSelection(p.id, e)}
                className="hover:text-red-signal transition-colors focus:outline-none focus:ring-2 focus:ring-red-signal rounded-full"
                aria-label={`Remove ${p.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate/50 group-focus-within:text-gold-hairline transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
          placeholder="Cari produk terkait (opsional)..."
          className="w-full bg-ivory/50 border border-slate/30 focus:border-gold-hairline focus:ring-1 focus:ring-gold-hairline rounded-radius-sm py-2 pl-10 pr-4 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
        />
      </div>

      {/* Dropdown / List */}
      <div className="max-h-[240px] overflow-y-auto border border-slate/20 rounded-radius-sm bg-white shadow-inner custom-scrollbar">
        {filteredProducts.length === 0 ? (
          <div className="p-space-4 text-center text-slate text-body-sm font-body">
            Tidak ada produk yang cocok dengan pencarian.
          </div>
        ) : (
          <div className="divide-y divide-slate/10">
            {filteredProducts.map((p) => {
              const isSelected = selectedIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => toggleSelection(p.id)}
                  className={`flex items-center gap-space-3 p-space-3 min-h-[44px] cursor-pointer hover:bg-ivory/50 transition-colors ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleSelection(p.id);
                    }
                  }}
                >
                  <div className={`w-5 h-5 flex shrink-0 items-center justify-center border rounded transition-colors ${isSelected ? 'bg-navy-deep border-navy-deep text-ivory' : 'border-slate/40 bg-white'}`}>
                    {isSelected && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body font-medium text-navy-deep text-body-sm leading-tight">{p.name}</span>
                    <span className="font-body text-slate text-caption">{p.categoryName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
