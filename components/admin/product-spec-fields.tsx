"use client";

import React from "react";

export type SpecRow = {
  id: string; // for React key
  label: string;
  value: string;
};

interface ProductSpecFieldsProps {
  items: SpecRow[];
  onChange: (specs: SpecRow[]) => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  addButtonText?: string;
}

export function ProductSpecFields({
  items,
  onChange,
  error,
  disabled = false,
  label = "Spesifikasi Teknis",
  addButtonText = "+ Tambah Spesifikasi",
}: ProductSpecFieldsProps) {

  const addRow = () => {
    onChange([...items, { id: crypto.randomUUID(), label: "", value: "" }]);
  };

  const removeRow = (id: string) => {
    onChange(items.filter((s) => s.id !== id));
  };

  const updateRow = (id: string, field: "label" | "value", newValue: string) => {
    onChange(
      items.map((s) => (s.id === id ? { ...s, [field]: newValue } : s))
    );
  };

  return (
    <div className="space-y-space-3">
      <div className="flex items-center justify-between">
        <label className="block font-body font-medium text-navy-deep text-body-sm">
          {label}
        </label>
        <button
          type="button"
          onClick={addRow}
          disabled={disabled}
          className="text-body-sm font-medium text-red-signal hover:text-red-signal/80 transition-colors disabled:opacity-50 min-h-[44px] px-2 -mr-2 flex items-center"
        >
          {addButtonText}
        </button>
      </div>

      {error && (
        <p className="text-red-signal text-body-sm mb-1">{error}</p>
      )}

      {items.length === 0 ? (
        <div className="p-space-4 border border-slate/20 border-dashed rounded-radius-sm text-center text-slate text-body-sm bg-ivory/30">
          Belum ada data ditambahkan.
        </div>
      ) : (
        <div className="space-y-space-2">
          {items.map((spec) => (
            <div key={spec.id} className="flex flex-col sm:flex-row gap-space-2 items-start bg-white sm:bg-transparent p-space-3 sm:p-0 rounded-radius-sm border border-slate/10 sm:border-none shadow-sm sm:shadow-none">
              <div className="w-full sm:flex-1">
                <input
                  type="text"
                  placeholder="Label (Contoh: Grade)"
                  value={spec.label}
                  onChange={(e) => updateRow(spec.id, "label", e.target.value)}
                  disabled={disabled}
                  className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
                />
              </div>
              <div className="w-full sm:flex-1">
                <input
                  type="text"
                  placeholder="Value (Contoh: SIR 20)"
                  value={spec.value}
                  onChange={(e) => updateRow(spec.id, "value", e.target.value)}
                  disabled={disabled}
                  className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => removeRow(spec.id)}
                disabled={disabled}
                className="w-full sm:w-[44px] h-[44px] shrink-0 flex items-center justify-center text-red-signal sm:text-slate hover:text-red-signal transition-colors disabled:opacity-50 rounded-radius-sm bg-red-signal/5 sm:bg-transparent sm:hover:bg-red-signal/5 border border-red-signal/20 sm:border-none mt-1 sm:mt-0"
                title="Hapus baris"
                aria-label="Hapus spesifikasi"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 sm:mr-0">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="sm:hidden font-medium text-body-sm">Hapus</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
