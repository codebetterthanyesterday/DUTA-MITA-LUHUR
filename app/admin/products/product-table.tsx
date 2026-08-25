"use client";

import React, { useState, useMemo, useTransition, useOptimistic, useEffect } from "react";
import { Pencil, Trash2, Package, CheckSquare, Square, X, FolderOpen, ShieldCheck, ShieldOff } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { SearchInput } from "@/components/admin/ui/toolbar";
import { Pagination } from "@/components/admin/ui/pagination";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { IconButton } from "@/components/admin/ui/icon-button";
import { deleteProduct, toggleProductStatus, bulkDeleteProducts, bulkUpdateProducts } from "./actions";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  rfqCount: number;
};

interface ProductTableProps {
  products: ProductRow[];
  categories: { id: string; name: string }[];
}

function StatusToggle({
  isActive,
  onToggle,
}: {
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border transition-colors min-h-[32px] ${
        isActive
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
          : "bg-slate/5 text-slate border-border-hairline hover:bg-slate/10"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-emerald-600" : "bg-slate/50"}`}
        aria-hidden="true"
      />
      {isActive ? "Aktif" : "Nonaktif"}
    </button>
  );
}

export function ProductTable({ products: initialProducts, categories }: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<"delete" | "category" | null>(null);
  const [targetCategory, setTargetCategory] = useState("");

  const [optimisticProducts, addOptimisticAction] = useOptimistic(
    initialProducts,
    (state, action: { type: "delete" | "toggle" | "bulk_delete" | "bulk_update"; id?: string; ids?: string[]; value?: boolean; categoryId?: string; categoryName?: string }) => {
      if (action.type === "delete" && action.id) {
        return state.filter((p) => p.id !== action.id);
      }
      if (action.type === "toggle" && action.id) {
        return state.map((p) => (p.id === action.id ? { ...p, isActive: action.value! } : p));
      }
      if (action.type === "bulk_delete" && action.ids) {
        return state.filter((p) => !action.ids!.includes(p.id));
      }
      if (action.type === "bulk_update" && action.ids) {
        return state.map((p) => {
          if (action.ids!.includes(p.id)) {
            return {
              ...p,
              isActive: action.value !== undefined ? action.value : p.isActive,
              categoryId: action.categoryId !== undefined ? action.categoryId : p.categoryId,
              categoryName: action.categoryName !== undefined ? action.categoryName : p.categoryName,
            };
          }
          return p;
        });
      }
      return state;
    }
  );

  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return optimisticProducts.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory ? p.categoryId === selectedCategory : true;
      return matchSearch && matchCat;
    });
  }, [optimisticProducts, search, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page]);

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [search, selectedCategory]);

  const allFilteredIds = filteredProducts.map(p => p.id);
  const isAllSelected = filteredProducts.length > 0 && selectedIds.size === filteredProducts.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allFilteredIds));
    }
  };

  const handleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      addOptimisticAction({ type: "toggle", id, value: !currentStatus });
      try {
        await toggleProductStatus(id, !currentStatus);
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      const id = deleteId;
      setDeleteId(null);
      addOptimisticAction({ type: "delete", id });
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    startTransition(async () => {
      const ids = Array.from(selectedIds);
      setSelectedIds(new Set());
      setBulkAction(null);
      addOptimisticAction({ type: "bulk_delete", ids });
      try {
        await bulkDeleteProducts(ids);
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleBulkStatus = (isActive: boolean) => {
    if (selectedIds.size === 0) return;
    startTransition(async () => {
      const ids = Array.from(selectedIds);
      setSelectedIds(new Set());
      addOptimisticAction({ type: "bulk_update", ids, value: isActive });
      try {
        await bulkUpdateProducts(ids, { isActive });
      } catch (err) {
        console.error(err);
      }
    });
  };
  
  const handleBulkCategory = () => {
    if (selectedIds.size === 0 || !targetCategory) return;
    const cat = categories.find(c => c.id === targetCategory);
    if (!cat) return;
    
    startTransition(async () => {
      const ids = Array.from(selectedIds);
      setSelectedIds(new Set());
      setBulkAction(null);
      setTargetCategory("");
      addOptimisticAction({ type: "bulk_update", ids, categoryId: cat.id, categoryName: cat.name });
      try {
        await bulkUpdateProducts(ids, { categoryId: cat.id });
      } catch (err) {
        console.error(err);
      }
    });
  };

  const productToDelete = optimisticProducts.find((p) => p.id === deleteId);
  const hasFilters = search !== "" || selectedCategory !== "";

  return (
    <div className="space-y-space-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-space-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari produk..."
          className="w-full sm:max-w-xs"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:max-w-xs bg-white border border-border-hairline focus:border-navy-deep focus:ring-2 focus:ring-navy-deep/10 rounded-radius-md px-space-3 py-2.5 min-h-[44px] text-navy-deep font-body text-body-md transition-all outline-none"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {paginatedProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title={hasFilters ? "Tidak ada produk yang cocok" : "Belum ada produk"}
          description={
            hasFilters
              ? "Coba ubah kata kunci pencarian atau filter kategori."
              : "Tambahkan produk pertama untuk mulai mengisi katalog."
          }
        />
      ) : (
        <>
          {/* Table (md and up) */}
          <div className="hidden md:block bg-white rounded-radius-md shadow-card border border-border-hairline overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body">
                <thead className="bg-navy-deep text-ivory text-body-sm font-medium">
                  <tr>
                    <th className="px-space-4 py-space-3 w-[40px]">
                      <button onClick={handleSelectAll} className="text-ivory/60 hover:text-ivory transition-colors">
                        {isAllSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                    </th>
                    <th className="px-space-4 py-space-3">Nama Produk</th>
                    <th className="px-space-4 py-space-3">Kategori</th>
                    <th className="px-space-4 py-space-3 text-center">Status</th>
                    <th className="px-space-4 py-space-3 text-center">RFQ</th>
                    <th className="px-space-4 py-space-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-hairline text-body-md text-navy-deep">
                  {paginatedProducts.map((product) => {
                    const isSelected = selectedIds.has(product.id);
                    return (
                      <tr key={product.id} className={`transition-colors group ${isSelected ? 'bg-navy-deep/5' : 'hover:bg-ivory/60'}`}>
                        <td className="px-space-4 py-space-3">
                          <button onClick={() => handleSelect(product.id)} className={`transition-colors ${isSelected ? 'text-navy-deep' : 'text-slate/40 hover:text-navy-deep'}`}>
                            {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                          </button>
                        </td>
                        <td className="px-space-4 py-space-3 font-medium">
                          {product.name}
                          <div className="text-body-sm text-slate font-normal font-mono">{product.slug}</div>
                        </td>
                        <td className="px-space-4 py-space-3 text-slate">{product.categoryName}</td>
                        <td className="px-space-4 py-space-3 text-center">
                          <StatusToggle
                            isActive={product.isActive}
                            onToggle={() => handleToggle(product.id, product.isActive)}
                          />
                        </td>
                        <td className="px-space-4 py-space-3 text-center text-slate">
                          {product.rfqCount > 0 ? (
                            <span
                              className="inline-flex items-center justify-center bg-navy-deep/5 text-navy-deep font-medium min-w-6 h-6 px-1.5 rounded-full text-xs"
                              style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                              {product.rfqCount}
                            </span>
                          ) : (
                            <span className="text-slate/40">–</span>
                          )}
                        </td>
                        <td className="px-space-4 py-space-3">
                          <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <IconButton
                              icon={Pencil}
                              label="Edit produk"
                              href={`products/${product.id}/edit`}
                            />
                            <IconButton
                              icon={Trash2}
                              label="Hapus produk"
                              tone="danger"
                              onClick={() => setDeleteId(product.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card list (below md) */}
          <div className="md:hidden space-y-space-3">
            {paginatedProducts.map((product) => {
              const isSelected = selectedIds.has(product.id);
              return (
                <div
                  key={product.id}
                  className={`rounded-radius-md shadow-card border p-space-4 space-y-space-3 transition-colors ${isSelected ? 'bg-navy-deep/5 border-navy-deep/20' : 'bg-white border-border-hairline'}`}
                >
                  <div className="flex items-start gap-3">
                    <button onClick={() => handleSelect(product.id)} className={`mt-0.5 shrink-0 transition-colors ${isSelected ? 'text-navy-deep' : 'text-slate/40 hover:text-navy-deep'}`}>
                      {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-space-2">
                        <div className="min-w-0">
                          <h3 className="font-medium text-navy-deep truncate">{product.name}</h3>
                          <div className="text-body-sm text-slate font-mono truncate">{product.slug}</div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 -mr-2">
                          <IconButton icon={Pencil} label="Edit produk" href={`products/${product.id}/edit`} />
                          <IconButton
                            icon={Trash2}
                            label="Hapus produk"
                            tone="danger"
                            onClick={() => setDeleteId(product.id)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-space-2 border-t border-border-hairline mt-3">
                        <span className="text-caption text-slate bg-ivory px-2 py-1 rounded-radius-sm">
                          {product.categoryName}
                        </span>
                        <StatusToggle
                          isActive={product.isActive}
                          onToggle={() => handleToggle(product.id, product.isActive)}
                        />
                        {product.rfqCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-caption text-navy-deep font-medium bg-navy-deep/5 px-2 py-1 rounded-radius-sm">
                            {product.rfqCount} RFQ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Produk"
        message={
          <>
            Apakah Anda yakin ingin menghapus produk <strong>{productToDelete?.name}</strong>?
            Tindakan ini tidak dapat dibatalkan, namun data pada RFQ terkait (jika ada) akan tetap aman.
          </>
        }
      />

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-navy-deep/10 rounded-radius-lg p-2 flex flex-col sm:flex-row items-center gap-3 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex items-center gap-3 px-3 py-1 bg-navy-deep/5 rounded-radius-md shrink-0 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-sm font-semibold text-navy-deep">{selectedIds.size} dipilih</span>
            <button onClick={() => setSelectedIds(new Set())} className="p-1 hover:bg-navy-deep/10 rounded-full text-slate transition-colors" title="Batal pilihan">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <button onClick={() => handleBulkStatus(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-radius-md transition-colors shrink-0">
              <ShieldCheck className="w-4 h-4" />
              Aktifkan
            </button>
            <button onClick={() => handleBulkStatus(false)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate hover:bg-slate/10 rounded-radius-md transition-colors shrink-0">
              <ShieldOff className="w-4 h-4" />
              Nonaktifkan
            </button>
            <button onClick={() => setBulkAction("category")} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-navy-deep bg-navy-deep/5 hover:bg-navy-deep/10 rounded-radius-md transition-colors shrink-0">
              <FolderOpen className="w-4 h-4" />
              Pindah
            </button>
            <div className="flex-1" />
            <button onClick={() => setBulkAction("delete")} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-signal bg-red-signal/10 hover:bg-red-signal/20 rounded-radius-md transition-colors shrink-0">
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
          </div>
        </div>
      )}
      
      {/* Bulk Delete Confirm */}
      <ConfirmDialog
        isOpen={bulkAction === "delete"}
        onClose={() => setBulkAction(null)}
        onConfirm={handleBulkDelete}
        title="Hapus Produk Massal"
        message={`Apakah Anda yakin ingin menghapus ${selectedIds.size} produk terpilih? Tindakan ini tidak dapat dibatalkan.`}
      />
      
      {/* Bulk Category Confirm */}
      <ConfirmDialog
        isOpen={bulkAction === "category"}
        onClose={() => { setBulkAction(null); setTargetCategory(""); }}
        onConfirm={handleBulkCategory}
        title="Pindah Kategori Massal"
        message={
          <div className="space-y-4 pt-2">
            <p>Pilih kategori baru untuk {selectedIds.size} produk terpilih:</p>
            <select
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
              className="w-full bg-white border border-border-hairline focus:border-navy-deep focus:ring-2 focus:ring-navy-deep/10 rounded-radius-md px-space-3 py-2.5 min-h-[44px] text-navy-deep font-body text-body-md outline-none"
            >
              <option value="" disabled>-- Pilih Kategori --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        }
      />
    </div>
  );
}
