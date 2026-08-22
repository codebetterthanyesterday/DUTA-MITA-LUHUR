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

      <div className="bg-white rounded-radius-md shadow-card border border-slate/10 overflow-hidden">
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
                    <td className="px-space-4 py-space-3 text-right space-x-3">
                      <Link
                        href={`categories/${cat.id}/edit`}
                        className="text-body-sm font-medium text-navy-deep hover:text-gold-hairline transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(cat.id)}
                        className="text-body-sm font-medium text-red-signal hover:text-red-signal/80 transition-colors"
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
