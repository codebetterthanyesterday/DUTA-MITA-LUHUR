"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { deleteCategory, reassignAndDeleteCategory } from "./actions";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ReassignDeleteDialog } from "@/components/admin/reassign-delete-dialog";

export type CategoryListItem = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  _count: { products: number };
};

interface CategoryTableProps {
  categories: CategoryListItem[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const categoryToDelete = categories.find(c => c.id === deleteId) || null;
  const hasProducts = (categoryToDelete?._count.products || 0) > 0;

  const handleConfirmSimpleDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      const res = await deleteCategory(deleteId);
      if (!res.success) {
        alert(res.error);
      }
      setDeleteId(null);
    });
  };

  const handleConfirmReassignDelete = (targetCategoryId: string) => {
    if (!deleteId) return;
    startTransition(async () => {
      const res = await reassignAndDeleteCategory(deleteId, targetCategoryId);
      if (!res.success) {
        alert(res.error);
      }
      setDeleteId(null);
    });
  };

  return (
    <div className="space-y-space-4">
      <div className="flex justify-between items-center mb-space-4">
        <h2 className="text-body-lg font-medium text-navy-deep">Daftar Kategori</h2>
        <Link
          href="categories/new"
          className="px-space-4 py-2 rounded-radius-sm text-body-sm font-medium bg-red-signal text-ivory hover:bg-red-signal/90 transition-colors shadow-sm"
        >
          Tambah Kategori Baru
        </Link>
      </div>

      {/* Table (Desktop/Tablet) */}
      <div className="hidden md:block bg-white rounded-radius-md shadow-card border border-slate/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-navy-base text-ivory text-body-sm font-medium">
              <tr>
                <th className="px-space-4 py-space-3">Nama</th>
                <th className="px-space-4 py-space-3 hidden sm:table-cell">Slug</th>
                <th className="px-space-4 py-space-3 text-center">Urutan</th>
                <th className="px-space-4 py-space-3 text-center">Jumlah Produk</th>
                <th className="px-space-4 py-space-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10 text-body-md text-navy-deep">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate/5 transition-colors">
                    <td className="px-space-4 py-space-3 font-medium">
                      {cat.name}
                      {/* Mobile slug fallback */}
                      <div className="sm:hidden text-caption font-mono text-slate mt-1">{cat.slug}</div>
                    </td>
                    <td className="px-space-4 py-space-3 hidden sm:table-cell text-caption font-mono text-slate">
                      {cat.slug}
                    </td>
                    <td className="px-space-4 py-space-3 text-center">
                      {cat.sortOrder}
                    </td>
                    <td className="px-space-4 py-space-3 text-center">
                      {cat._count.products}
                    </td>
                    <td className="px-space-4 py-space-3 text-right space-x-2">
                      <Link
                        href={`categories/${cat.id}/edit`}
                        className="inline-flex items-center justify-center text-body-sm font-medium text-navy-deep hover:bg-slate/10 rounded transition-colors min-w-[44px] min-h-[44px] px-2"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(cat.id)}
                        className="inline-flex items-center justify-center text-body-sm font-medium text-red-signal hover:bg-red-signal/10 rounded transition-colors min-w-[44px] min-h-[44px] px-2"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-space-4 py-space-8 text-center text-slate">
                    Belum ada kategori yang dibuat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card List (Mobile) */}
      <div className="md:hidden space-y-space-4">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-radius-md shadow-card border border-slate/10 p-space-4 space-y-space-3">
              <div className="flex justify-between items-start gap-space-2">
                <div>
                  <h3 className="font-medium text-navy-deep">{cat.name}</h3>
                  <div className="text-caption font-mono text-slate mt-1">{cat.slug}</div>
                </div>
                <div className="flex items-center gap-space-1 shrink-0">
                  <Link
                    href={`categories/${cat.id}/edit`}
                    className="p-2 text-slate hover:text-navy-deep hover:bg-slate/10 rounded transition-colors min-w-[44px] min-h-[44px] flex justify-center items-center"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Link>
                  <button
                    onClick={() => setDeleteId(cat.id)}
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
              <div className="flex justify-between items-center text-body-sm border-t border-slate/10 pt-space-2">
                <span className="text-slate">Urutan:</span>
                <span className="font-medium text-navy-deep">{cat.sortOrder}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm">
                <span className="text-slate">Jumlah Produk:</span>
                <span className="font-medium text-navy-deep">{cat._count.products}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-radius-md shadow-card border border-slate/10 p-space-8 text-center text-slate">
            Belum ada kategori yang dibuat.
          </div>
        )}
      </div>

      {/* Conditionally render the correct dialog based on product count */}
      {categoryToDelete && (
        hasProducts ? (
          <ReassignDeleteDialog
            isOpen={true}
            onClose={() => !isPending && setDeleteId(null)}
            onConfirm={handleConfirmReassignDelete}
            category={categoryToDelete}
            allCategories={categories}
            isPending={isPending}
          />
        ) : (
          <ConfirmDialog
            isOpen={true}
            onClose={() => !isPending && setDeleteId(null)}
            onConfirm={handleConfirmSimpleDelete}
            title="Hapus Kategori"
            message={`Hapus kategori ${categoryToDelete.name}? Tindakan ini tidak dapat dibatalkan.`}
            isPending={isPending}
          />
        )
      )}
    </div>
  );
}
