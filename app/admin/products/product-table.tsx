"use client";

import React, { useState, useMemo, useTransition, useOptimistic } from "react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteProduct, toggleProductStatus } from "./actions";

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

export function ProductTable({ products: initialProducts, categories }: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Optimistic UI for Status Toggle and Deletion
  const [optimisticProducts, addOptimisticAction] = useOptimistic(
    initialProducts,
    (state, action: { type: "delete" | "toggle"; id: string; value?: boolean }) => {
      if (action.type === "delete") {
        return state.filter((p) => p.id !== action.id);
      }
      if (action.type === "toggle") {
        return state.map((p) =>
          p.id === action.id ? { ...p, isActive: action.value! } : p
        );
      }
      return state;
    }
  );

  const [isPending, startTransition] = useTransition();

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter
  const filteredProducts = useMemo(() => {
    return optimisticProducts.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory ? p.categoryId === selectedCategory : true;
      return matchSearch && matchCat;
    });
  }, [optimisticProducts, search, selectedCategory]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page]);

  // Handle page reset on filter change
  React.useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

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
      setDeleteId(null); // Optimistically close modal
      addOptimisticAction({ type: "delete", id });
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error(err);
      }
    });
  };

  const productToDelete = optimisticProducts.find(p => p.id === deleteId);

  return (
    <div className="space-y-space-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-space-4">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs bg-white border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors outline-none"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:max-w-xs bg-white border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors outline-none"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table (Desktop/Tablet) */}
      <div className="hidden md:block bg-white rounded-radius-md shadow-card border border-slate/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-navy-base text-ivory text-body-sm font-medium">
              <tr>
                <th className="px-space-4 py-space-3">Nama Produk</th>
                <th className="px-space-4 py-space-3">Kategori</th>
                <th className="px-space-4 py-space-3 text-center">Status</th>
                <th className="px-space-4 py-space-3 text-center">Terkait RFQ</th>
                <th className="px-space-4 py-space-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10 text-body-md text-navy-deep">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate/5 transition-colors">
                    <td className="px-space-4 py-space-3 font-medium">
                      {product.name}
                      <div className="text-body-sm text-slate font-normal">{product.slug}</div>
                    </td>
                    <td className="px-space-4 py-space-3 text-slate">
                      {product.categoryName}
                    </td>
                    <td className="px-space-4 py-space-3 text-center">
                      <button
                        onClick={() => handleToggle(product.id, product.isActive)}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold uppercase transition-colors ${
                          product.isActive
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-slate/10 text-slate hover:bg-slate/20"
                        }`}
                      >
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-space-4 py-space-3 text-center text-slate">
                      {product.rfqCount > 0 ? (
                        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-medium px-2 rounded-full text-xs">
                          {product.rfqCount}
                        </span>
                      ) : (
                        <span className="text-slate/50">-</span>
                      )}
                    </td>
                    <td className="px-space-4 py-space-3 text-right">
                      <div className="flex items-center justify-end gap-space-2">
                        <Link
                          href={`products/${product.id}/edit`}
                          className="p-2 text-slate hover:text-red-signal hover:bg-red-signal/10 rounded transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 text-slate hover:text-red-signal hover:bg-red-signal/10 rounded transition-colors"
                          title="Hapus"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-space-4 py-space-8 text-center text-slate">
                    Tidak ada produk ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card List (Mobile) */}
      <div className="md:hidden space-y-space-4">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-radius-md shadow-card border border-slate/10 p-space-4 space-y-space-3">
              <div className="flex justify-between items-start gap-space-2">
                <div>
                  <h3 className="font-medium text-navy-deep">{product.name}</h3>
                  <div className="text-body-sm text-slate">{product.slug}</div>
                </div>
                <div className="flex items-center gap-space-1 shrink-0">
                  <Link
                    href={`products/${product.id}/edit`}
                    className="p-2 text-slate hover:text-red-signal hover:bg-red-signal/10 rounded transition-colors min-w-[44px] min-h-[44px] flex justify-center items-center"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Link>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="p-2 text-slate hover:text-red-signal hover:bg-red-signal/10 rounded transition-colors min-w-[44px] min-h-[44px] flex justify-center items-center"
                    title="Hapus"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-body-sm">
                <span className="text-slate">Kategori:</span>
                <span className="font-medium text-navy-deep">{product.categoryName}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm">
                <span className="text-slate">Status:</span>
                <button
                  onClick={() => handleToggle(product.id, product.isActive)}
                  className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-bold uppercase transition-colors min-h-[44px] min-w-[80px] ${
                    product.isActive
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-slate/10 text-slate hover:bg-slate/20"
                  }`}
                >
                  {product.isActive ? "Aktif" : "Nonaktif"}
                </button>
              </div>
              <div className="flex justify-between items-center text-body-sm">
                <span className="text-slate">Terkait RFQ:</span>
                {product.rfqCount > 0 ? (
                  <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full text-xs">
                    {product.rfqCount}
                  </span>
                ) : (
                  <span className="text-slate/50">-</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-radius-md shadow-card border border-slate/10 p-space-8 text-center text-slate">
            Tidak ada produk ditemukan.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-space-4 py-space-4 bg-white rounded-radius-md shadow-card border border-slate/10 flex flex-col sm:flex-row items-center justify-between gap-space-4">
          <span className="text-body-sm text-slate">
            Menampilkan {Math.min((page - 1) * itemsPerPage + 1, filteredProducts.length)} - {Math.min(page * itemsPerPage, filteredProducts.length)} dari {filteredProducts.length}
          </span>
          <div className="flex items-center gap-space-2 w-full sm:w-auto">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex-1 sm:flex-none px-3 py-1 min-h-[44px] rounded-radius-sm border border-slate/20 text-body-sm font-medium hover:bg-slate/5 disabled:opacity-50 transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex-1 sm:flex-none px-3 py-1 min-h-[44px] rounded-radius-sm border border-slate/20 text-body-sm font-medium hover:bg-slate/5 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
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
    </div>
  );
}
