"use client";

import { useActionState } from "react";
import { submitRfq, RfqActionState } from "@/app/(public)/rfq/actions";
import { ProductMultiSelect } from "./product-multi-select";
import { countries } from "@/lib/countries";
import React from "react";

const initialState: RfqActionState = {};

type ProductOption = {
  id: string;
  name: string;
  categoryName: string;
};

interface RfqFormProps {
  products: ProductOption[];
  initialSelectedIds?: string[];
}

export function RfqForm({ products, initialSelectedIds = [] }: RfqFormProps) {
  const [state, formAction, isPending] = useActionState(submitRfq, initialState);

  // Success State Transition
  if (state.success) {
    return (
      <div className="bg-white rounded-radius-md shadow-card p-space-6 md:p-space-8 flex flex-col items-center justify-center text-center h-full min-h-[400px] animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-navy-base/5 text-red-signal rounded-full flex items-center justify-center mb-space-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-medium text-display-md text-navy-deep mb-space-2">
          Terima Kasih!
        </h3>
        <p className="font-body text-slate text-body-md max-w-sm mb-space-6">
          Terima kasih, tim kami akan menghubungi Anda dalam 1–2 hari kerja.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-navy-deep hover:bg-navy-base text-ivory px-space-4 py-space-2 rounded-radius-sm font-body font-medium transition-colors"
        >
          Ajukan RFQ Lain
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-radius-md shadow-card p-space-6 md:p-space-8 w-full max-w-3xl mx-auto">
      <div className="mb-space-8 border-b border-slate/10 pb-space-4">
        <h2 className="font-display font-medium text-display-md text-navy-deep mb-space-2">
          Detail Permintaan Penawaran
        </h2>
        <p className="font-body text-body-sm text-slate">
          Lengkapi form di bawah ini untuk mendapatkan estimasi harga dan waktu tunggu dari tim sales kami.
        </p>
      </div>

      <form action={formAction} className="space-y-space-6">
        {state.error && (
          <div className="p-space-3 bg-red-signal/10 border border-red-signal/20 text-red-signal text-body-sm rounded-radius-sm">
            {state.error}
          </div>
        )}

        {/* Honeypot field - visually hidden accessibly */}
        <div
          className="absolute left-[-9999px] top-[-9999px]"
          aria-hidden="true"
        >
          <label htmlFor="companyWebsite">Website Perusahaan</label>
          <input
            type="text"
            id="companyWebsite"
            name="companyWebsite"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          <div>
            <label htmlFor="name" className="block font-body font-medium text-navy-deep text-body-sm mb-1">
              Nama Lengkap <span className="text-red-signal">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={""}
              disabled={isPending}
              className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
            />
            {state.fieldErrors?.name && (
              <p className="text-red-signal text-body-sm mt-1">{state.fieldErrors.name[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="company" className="block font-body font-medium text-navy-deep text-body-sm mb-1">
              Perusahaan <span className="text-red-signal">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              defaultValue={""}
              disabled={isPending}
              className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
            />
            {state.fieldErrors?.company && (
              <p className="text-red-signal text-body-sm mt-1">{state.fieldErrors.company[0]}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          <div>
            <label htmlFor="email" className="block font-body font-medium text-navy-deep text-body-sm mb-1">
              Email <span className="text-red-signal">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={""}
              disabled={isPending}
              className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
            />
            {state.fieldErrors?.email && (
              <p className="text-red-signal text-body-sm mt-1">{state.fieldErrors.email[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block font-body font-medium text-navy-deep text-body-sm mb-1">
              Telepon <span className="text-red-signal">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={""}
              disabled={isPending}
              className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
            />
            {state.fieldErrors?.phone && (
              <p className="text-red-signal text-body-sm mt-1">{state.fieldErrors.phone[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="country" className="block font-body font-medium text-navy-deep text-body-sm mb-1">
            Negara <span className="text-red-signal">*</span>
          </label>
          <select
            id="country"
            name="country"
            defaultValue={""}
            disabled={isPending}
            className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
          >
            <option value="" disabled>Pilih Negara...</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {state.fieldErrors?.country && (
            <p className="text-red-signal text-body-sm mt-1">{state.fieldErrors.country[0]}</p>
          )}
        </div>

        <div>
          <label className="block font-body font-medium text-navy-deep text-body-sm mb-1">
            Produk Terkait (Opsional)
          </label>
          <ProductMultiSelect
            products={products}
            initialSelectedIds={initialSelectedIds}
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block font-body font-medium text-navy-deep text-body-sm mb-1">
            Kuantitas Estimasi (Opsional)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              id="quantityEstimateValue"
              name="quantityEstimateValue"
              min="0"
              step="any"
              defaultValue={""}
              placeholder="Jumlah"
              disabled={isPending}
              className="w-2/3 bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
            />
            <select
              id="quantityEstimateUnit"
              name="quantityEstimateUnit"
              defaultValue={""}
              disabled={isPending}
              className="w-1/3 bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
            >
              <option value="">Unit...</option>
              <option value="ton">Ton (MT)</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="container">Kontainer</option>
              <option value="bal">Bal</option>
            </select>
          </div>
          {state.fieldErrors?.quantityEstimateValue && (
            <p className="text-red-signal text-body-sm mt-1">{state.fieldErrors.quantityEstimateValue[0]}</p>
          )}
          {state.fieldErrors?.quantityEstimateUnit && (
             <p className="text-red-signal text-body-sm mt-1">{state.fieldErrors.quantityEstimateUnit[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block font-body font-medium text-navy-deep text-body-sm mb-1">
            Pesan Tambahan (Opsional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            disabled={isPending}
            className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none resize-y"
            placeholder="Tambahkan informasi spesifik, pertanyaan lead time, dsb."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full min-h-[44px] flex items-center justify-center bg-red-signal hover:bg-red-signal/90 disabled:bg-red-signal/60 disabled:cursor-not-allowed text-ivory font-body font-medium rounded-radius-sm py-3 transition-colors mt-space-6"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-ivory" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengirim...
            </span>
          ) : (
            "Ajukan RFQ"
          )}
        </button>
      </form>
    </div>
  );
}
