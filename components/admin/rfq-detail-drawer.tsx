"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RfqStatus } from "@prisma/client";
import { StatusBadge } from "./status-badge";

export type DrawerRfq = {
  id: string;
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  quantityEstimateValue: number | null;
  quantityEstimateUnit: string | null;
  message: string | null;
  status: RfqStatus;
  createdAt: Date;
  products: { id: string; name: string }[];
};

interface RfqDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rfq: DrawerRfq | null;
  onStatusChange: (id: string, newStatus: RfqStatus) => void;
  isPending?: boolean;
}

export function RfqDetailDrawer({
  isOpen,
  onClose,
  rfq,
  onStatusChange,
  isPending = false,
}: RfqDetailDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isPending) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isPending]);

  if (!isOpen || !rfq) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => !isPending && onClose()}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full md:w-[600px] h-full bg-white shadow-card animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-space-6 border-b border-slate/20 bg-ivory/50 flex items-start justify-between">
          <div>
            <h2 className="font-display font-medium text-display-md text-navy-deep mb-space-1">
              {rfq.name}
            </h2>
            <div className="font-body text-body-sm text-slate flex flex-wrap gap-2 items-center">
              <span>{rfq.company}</span>
              <span className="text-slate/40">•</span>
              <span>
                {rfq.createdAt.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="mt-space-3">
              <StatusBadge status={rfq.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-2 -mr-2 text-slate hover:text-red-signal transition-colors rounded-full hover:bg-slate/10"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-space-6 font-body text-navy-deep space-y-space-6">
          
          {/* Contact Details */}
          <div>
            <h3 className="text-body-sm font-medium text-slate uppercase tracking-wider mb-space-2">Kontak & Lokasi</h3>
            <div className="space-y-space-2 text-body-md">
              <div className="flex items-center gap-space-3">
                <svg className="text-slate/60 shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <a href={`mailto:${rfq.email}`} className="hover:text-red-signal hover:underline transition-colors break-all">
                  {rfq.email}
                </a>
              </div>
              <div className="flex items-center gap-space-3">
                <svg className="text-slate/60 shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <a href={`tel:${rfq.phone}`} className="hover:text-red-signal hover:underline transition-colors">
                  {rfq.phone}
                </a>
              </div>
              <div className="flex items-center gap-space-3">
                <svg className="text-slate/60 shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"></circle><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"></path></svg>
                <span>{rfq.country}</span>
              </div>
            </div>
          </div>

          <hr className="border-slate/10" />

          {/* Interest & Quantity */}
          <div>
            <h3 className="text-body-sm font-medium text-slate uppercase tracking-wider mb-space-3">Kebutuhan Produk</h3>
            
            <div className="mb-space-4">
              {rfq.products.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {rfq.products.map(p => (
                    <Link
                      key={p.id}
                      href={`../products/${p.id}/edit`} // PBI-14: products/[id]/edit relative link
                      className="inline-flex px-3 py-1 bg-navy-base/5 border border-navy-deep/10 rounded-full text-body-sm hover:bg-red-signal/10 hover:border-red-signal/30 hover:text-red-signal transition-colors"
                      title="Lihat Produk"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="text-slate italic text-body-md">Pertanyaan Umum, tidak terkait produk spesifik</span>
              )}
            </div>

            {rfq.quantityEstimateValue !== null && (
              <div className="bg-ivory/50 rounded-radius-sm p-space-4 border border-slate/10 inline-block">
                <span className="block text-body-sm text-slate mb-1">Estimasi Kuantitas:</span>
                <span className="font-medium text-navy-deep text-body-lg">
                  {rfq.quantityEstimateValue.toString()} {rfq.quantityEstimateUnit}
                </span>
              </div>
            )}
          </div>

          <hr className="border-slate/10" />

          {/* Message */}
          <div>
            <h3 className="text-body-sm font-medium text-slate uppercase tracking-wider mb-space-3">Pesan dari Klien</h3>
            {rfq.message ? (
              <div className="bg-ivory rounded-radius-md p-space-5 border border-slate/10 shadow-inner">
                <p className="whitespace-pre-wrap text-body-md leading-relaxed text-navy-deep">
                  {rfq.message}
                </p>
              </div>
            ) : (
              <p className="text-slate italic text-body-md">Tidak ada pesan tambahan</p>
            )}
          </div>

        </div>

        {/* Footer / Status Control */}
        <div className="flex-shrink-0 p-space-6 border-t border-slate/20 bg-ivory/50">
          <label className="block text-body-sm font-medium text-slate mb-space-2">
            Perbarui Status
          </label>
          <select
            value={rfq.status}
            onChange={(e) => onStatusChange(rfq.id, e.target.value as RfqStatus)}
            disabled={isPending}
            className="w-full bg-white border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors outline-none disabled:opacity-50"
          >
            <option value="NEW">Baru</option>
            <option value="IN_PROGRESS">Diproses</option>
            <option value="CLOSED">Selesai</option>
          </select>
        </div>

      </div>
    </div>
  );
}
