"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RfqStatus } from "@prisma/client";
import { Mail, Phone, MapPin, X, Package } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { SelectField } from "./ui/form-fields";

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
    <div className="fixed inset-0 z-[100] flex md:justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm animate-admin-fade-in"
        onClick={() => !isPending && onClose()}
        aria-hidden="true"
      />

      {/* Panel — full-bleed sheet on mobile, side drawer from md up */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full md:w-[600px] h-full bg-white shadow-card-hover flex flex-col animate-admin-slide-up md:animate-admin-slide-right"
      >
        {/* Header */}
        <div className="shrink-0 p-space-5 md:p-space-6 border-b border-border-hairline bg-ivory/60 flex items-start justify-between gap-space-3">
          <div className="min-w-0">
            <h2 className="font-display font-medium text-display-md text-navy-deep mb-1 truncate">
              {rfq.name}
            </h2>
            <div className="font-body text-body-sm text-slate flex flex-wrap gap-1.5 items-center">
              <span>{rfq.company}</span>
              <span className="text-slate/40">·</span>
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
            <div className="mt-space-2">
              <StatusBadge status={rfq.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-11 h-11 -mr-2 -mt-1 shrink-0 flex items-center justify-center text-slate hover:text-red-signal hover:bg-red-signal/10 rounded-full transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-space-5 md:p-space-6 font-body text-navy-deep space-y-space-6 overscroll-contain">
          {/* Contact */}
          <div>
            <h3 className="text-body-sm font-medium text-slate uppercase tracking-wider mb-space-3">
              Kontak & Lokasi
            </h3>
            <div className="space-y-space-2 text-body-md">
              <a
                href={`mailto:${rfq.email}`}
                className="flex items-center gap-space-3 hover:text-red-signal transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center shrink-0 group-hover:bg-red-signal/10 transition-colors">
                  <Mail className="w-4 h-4 text-slate group-hover:text-red-signal transition-colors" aria-hidden="true" />
                </span>
                <span className="break-all">{rfq.email}</span>
              </a>
              <a
                href={`tel:${rfq.phone}`}
                className="flex items-center gap-space-3 hover:text-red-signal transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center shrink-0 group-hover:bg-red-signal/10 transition-colors">
                  <Phone className="w-4 h-4 text-slate group-hover:text-red-signal transition-colors" aria-hidden="true" />
                </span>
                {rfq.phone}
              </a>
              <div className="flex items-center gap-space-3">
                <span className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-slate" aria-hidden="true" />
                </span>
                {rfq.country}
              </div>
            </div>
          </div>

          <hr className="border-border-hairline" />

          {/* Products & quantity */}
          <div>
            <h3 className="text-body-sm font-medium text-slate uppercase tracking-wider mb-space-3">
              Kebutuhan Produk
            </h3>

            <div className="mb-space-4">
              {rfq.products.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {rfq.products.map((p) => (
                    <Link
                      key={p.id}
                      href={`../products/${p.id}/edit`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] bg-navy-deep/5 border border-navy-deep/10 rounded-full text-body-sm hover:bg-red-signal/10 hover:border-red-signal/30 hover:text-red-signal transition-colors"
                    >
                      <Package className="w-3.5 h-3.5" aria-hidden="true" />
                      {p.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="text-slate italic text-body-md">
                  Pertanyaan umum, tidak terkait produk spesifik
                </span>
              )}
            </div>

            {rfq.quantityEstimateValue !== null && (
              <div className="bg-ivory rounded-radius-md p-space-4 border border-border-hairline inline-block">
                <span className="block text-body-sm text-slate mb-1">Estimasi Kuantitas</span>
                <span className="font-display font-medium text-navy-deep text-display-sm">
                  {rfq.quantityEstimateValue.toString()} {rfq.quantityEstimateUnit}
                </span>
              </div>
            )}
          </div>

          <hr className="border-border-hairline" />

          {/* Message */}
          <div>
            <h3 className="text-body-sm font-medium text-slate uppercase tracking-wider mb-space-3">
              Pesan dari Klien
            </h3>
            {rfq.message ? (
              <div className="bg-ivory rounded-radius-md p-space-5 border border-border-hairline">
                <p className="whitespace-pre-wrap text-body-md leading-relaxed text-navy-deep">
                  {rfq.message}
                </p>
              </div>
            ) : (
              <p className="text-slate italic text-body-md">Tidak ada pesan tambahan</p>
            )}
          </div>
        </div>

        {/* Footer — status control, safe-area aware on mobile */}
        <div className="shrink-0 p-space-5 md:p-space-6 border-t border-border-hairline bg-ivory/60 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <SelectField
            label="Perbarui Status"
            value={rfq.status}
            onChange={(e) => onStatusChange(rfq.id, e.target.value as RfqStatus)}
            disabled={isPending}
            className="bg-white"
          >
            <option value="NEW">Baru</option>
            <option value="IN_PROGRESS">Diproses</option>
            <option value="CLOSED">Selesai</option>
          </SelectField>
        </div>
      </div>
    </div>
  );
}
