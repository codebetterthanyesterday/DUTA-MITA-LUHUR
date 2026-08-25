"use client";

import React, { useState, useTransition } from "react";
import { Pencil, Trash2, FolderOpen, GripVertical } from "lucide-react";
import { deleteCategory, reassignAndDeleteCategory } from "./actions";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ReassignDeleteDialog } from "@/components/admin/reassign-delete-dialog";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { IconButton } from "@/components/admin/ui/icon-button";

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

  const categoryToDelete = categories.find((c) => c.id === deleteId) || null;
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
      {categories.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Belum ada kategori"
          description="Buat kategori pertama untuk mulai mengelompokkan produk."
        />
      ) : (
        <>
          {/* Table (md and up) */}
          <div className="hidden md:block bg-white rounded-radius-md shadow-card border border-border-hairline overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body">
                <thead className="bg-navy-deep text-ivory text-body-sm font-medium">
                  <tr>
                    <th className="px-space-4 py-space-3">Nama</th>
                    <th className="px-space-4 py-space-3 hidden lg:table-cell">Slug</th>
                    <th className="px-space-4 py-space-3 text-center">Urutan</th>
                    <th className="px-space-4 py-space-3 text-center">Produk</th>
                    <th className="px-space-4 py-space-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-hairline text-body-md text-navy-deep">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-ivory/60 transition-colors group">
                      <td className="px-space-4 py-space-3 font-medium">
                        {cat.name}
                        <div className="lg:hidden text-caption font-mono text-slate mt-1">{cat.slug}</div>
                      </td>
                      <td className="px-space-4 py-space-3 hidden lg:table-cell text-caption font-mono text-slate">
                        {cat.slug}
                      </td>
                      <td className="px-space-4 py-space-3 text-center">
                        <span className="inline-flex items-center gap-1 text-slate">
                          <GripVertical className="w-3.5 h-3.5 text-slate/40" aria-hidden="true" />
                          {cat.sortOrder}
                        </span>
                      </td>
                      <td className="px-space-4 py-space-3 text-center">
                        <span
                          className="inline-flex items-center justify-center bg-navy-deep/5 text-navy-deep font-medium min-w-6 h-6 px-1.5 rounded-full text-xs"
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {cat._count.products}
                        </span>
                      </td>
                      <td className="px-space-4 py-space-3">
                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <IconButton icon={Pencil} label="Edit kategori" href={`categories/${cat.id}/edit`} />
                          <IconButton
                            icon={Trash2}
                            label="Hapus kategori"
                            tone="danger"
                            onClick={() => setDeleteId(cat.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card list (below md) */}
          <div className="md:hidden space-y-space-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-radius-md shadow-card border border-border-hairline p-space-4 space-y-space-3"
              >
                <div className="flex justify-between items-start gap-space-2">
                  <div className="min-w-0">
                    <h3 className="font-medium text-navy-deep truncate">{cat.name}</h3>
                    <div className="text-caption font-mono text-slate mt-1 truncate">{cat.slug}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 -mr-2">
                    <IconButton icon={Pencil} label="Edit kategori" href={`categories/${cat.id}/edit`} />
                    <IconButton
                      icon={Trash2}
                      label="Hapus kategori"
                      tone="danger"
                      onClick={() => setDeleteId(cat.id)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-space-2 border-t border-border-hairline">
                  <span className="text-caption text-slate bg-ivory px-2 py-1 rounded-radius-sm">
                    Urutan {cat.sortOrder}
                  </span>
                  <span className="text-caption text-navy-deep font-medium bg-navy-deep/5 px-2 py-1 rounded-radius-sm">
                    {cat._count.products} produk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {categoryToDelete &&
        (hasProducts ? (
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
        ))}
    </div>
  );
}
