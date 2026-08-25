"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { CategoryListItem } from "@/app/admin/categories/category-table";

interface ReassignDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetCategoryId: string) => void;
  category: CategoryListItem | null;
  allCategories: CategoryListItem[];
  isPending: boolean;
}

export function ReassignDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  category,
  allCategories,
  isPending,
}: ReassignDeleteDialogProps) {
  const [targetId, setTargetId] = useState("");

  if (!isOpen || !category) return null;

  const validTargets = allCategories.filter(c => c.id !== category.id);
  const hasValidTarget = validTargets.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm animate-admin-fade-in"
        onClick={() => !isPending && onClose()}
      />

      {/* Dialog */}
      <div
        className="relative bg-white rounded-radius-md shadow-card-hover w-full max-w-md max-h-[90dvh] flex flex-col overflow-hidden animate-admin-pop"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-space-6 flex-1 overflow-y-auto">
          <div className="w-11 h-11 rounded-full bg-gold-hairline/15 flex items-center justify-center mb-space-4">
            <AlertTriangle className="w-5 h-5 text-gold-hairline" aria-hidden="true" />
          </div>
          <h3 className="font-display text-display-sm text-navy-deep font-medium mb-space-3">
            Hapus & Pindahkan Produk
          </h3>

          <div className="text-body-md text-slate space-y-space-4">
            <p>
              Kategori <strong>{category.name}</strong> masih digunakan oleh <strong>{category._count.products} produk</strong>.
            </p>

            {hasValidTarget ? (
              <>
                <p>
                  Pilih kategori tujuan untuk memindahkan produk-produk tersebut sebelum kategori ini dihapus:
                </p>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  disabled={isPending}
                  className="w-full bg-ivory border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors outline-none disabled:opacity-50"
                >
                  <option value="" disabled>-- Pilih Kategori Tujuan --</option>
                  {validTargets.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </>
            ) : (
              <div className="p-space-4 bg-gold-hairline/10 border border-gold-hairline/30 rounded-radius-sm text-navy-deep">
                <strong>Tidak dapat menghapus:</strong> Ini adalah satu-satunya kategori yang ada di sistem. Anda harus membuat kategori lain terlebih dahulu sebelum memindahkan produk dan menghapus kategori ini.
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-ivory/50 px-space-6 py-space-4 border-t border-slate/10 flex justify-end gap-space-3 shrink-0">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-space-4 py-2 rounded-radius-sm text-body-sm font-medium text-slate hover:bg-slate/10 transition-colors disabled:opacity-50 min-h-[44px]"
          >
            Batal
          </button>
          
          {hasValidTarget && (
            <button
              onClick={() => onConfirm(targetId)}
              disabled={isPending || !targetId}
              className="px-space-4 py-2 rounded-radius-sm text-body-sm font-medium bg-red-signal text-ivory hover:bg-red-signal/90 transition-colors disabled:opacity-50 shadow-sm min-h-[44px] flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
              {isPending ? "Memproses..." : "Pindahkan & Hapus"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
