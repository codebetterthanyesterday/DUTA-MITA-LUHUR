"use client";

import React from "react";
import { Plus, X } from "lucide-react";

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
}

const inputClasses =
  "w-full bg-white border border-border-hairline focus:border-navy-deep focus:ring-2 focus:ring-navy-deep/10 rounded-radius-sm px-space-3 py-2 min-h-[40px] text-navy-deep font-body text-body-sm transition-all disabled:opacity-50 outline-none";

/**
 * Key/value spec editor. Each row reads as one attribute — label on the
 * left, value on the right — with the remove control anchored to the row's
 * own end rather than off to one side, so touch and pointer targets line up.
 */
export function ProductSpecFields({ items, onChange, error, disabled = false }: ProductSpecFieldsProps) {
  const addRow = () => {
    onChange([...items, { id: crypto.randomUUID(), label: "", value: "" }]);
  };

  const removeRow = (id: string) => {
    onChange(items.filter((s) => s.id !== id));
  };

  const updateRow = (id: string, field: "label" | "value", newValue: string) => {
    onChange(items.map((s) => (s.id === id ? { ...s, [field]: newValue } : s)));
  };

  return (
    <div className="space-y-space-3">
      {error && <p className="text-red-signal text-body-sm">{error}</p>}

      {items.length === 0 ? (
        <p className="text-body-sm text-slate">Belum ada spesifikasi ditambahkan.</p>
      ) : (
        <div className="space-y-space-2">
          {items.map((spec, index) => (
            <div
              key={spec.id}
              className="flex items-center gap-space-2 bg-ivory/50 rounded-radius-sm p-space-2 border border-border-hairline"
            >
              <span
                className="hidden sm:flex w-6 h-6 shrink-0 items-center justify-center rounded-full bg-navy-deep/5 text-caption font-medium text-slate"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <input
                type="text"
                placeholder="Label (Grade)"
                value={spec.label}
                onChange={(e) => updateRow(spec.id, "label", e.target.value)}
                disabled={disabled}
                className={`${inputClasses} flex-1 min-w-0`}
              />
              <span className="text-slate/40 shrink-0" aria-hidden="true">:</span>
              <input
                type="text"
                placeholder="Nilai (SIR 20)"
                value={spec.value}
                onChange={(e) => updateRow(spec.id, "value", e.target.value)}
                disabled={disabled}
                className={`${inputClasses} flex-1 min-w-0`}
              />
              <button
                type="button"
                onClick={() => removeRow(spec.id)}
                disabled={disabled}
                className="shrink-0 w-9 h-9 flex items-center justify-center text-slate hover:text-red-signal hover:bg-red-signal/10 rounded-radius-sm transition-colors disabled:opacity-50"
                title="Hapus baris"
                aria-label="Hapus spesifikasi ini"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addRow}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-1.5 py-space-2 min-h-[40px] rounded-radius-sm border-2 border-dashed border-border-hairline text-body-sm font-medium text-slate hover:text-navy-deep hover:border-navy-deep/30 transition-colors disabled:opacity-50"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
        Tambah Spesifikasi
      </button>
    </div>
  );
}
