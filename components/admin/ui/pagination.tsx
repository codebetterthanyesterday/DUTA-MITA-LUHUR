"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const start = Math.min((page - 1) * itemsPerPage + 1, totalItems);
  const end = Math.min(page * itemsPerPage, totalItems);

  return (
    <div className="px-space-4 py-space-3 bg-white rounded-radius-md shadow-card border border-border-hairline flex flex-col sm:flex-row items-center justify-between gap-space-3">
      <span
        className="font-body text-body-sm text-slate order-2 sm:order-1"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        Menampilkan {start}–{end} dari {totalItems}
      </span>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Halaman sebelumnya"
          className="w-11 h-11 flex items-center justify-center rounded-radius-sm border border-border-hairline text-navy-deep hover:bg-navy-deep/5 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
        <span
          className="px-space-3 font-body text-body-sm text-navy-deep font-medium min-w-[88px] text-center"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Halaman berikutnya"
          className="w-11 h-11 flex items-center justify-center rounded-radius-sm border border-border-hairline text-navy-deep hover:bg-navy-deep/5 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
