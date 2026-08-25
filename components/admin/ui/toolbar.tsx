"use client";

import { Search, X } from "lucide-react";

/**
 * Search input with a leading icon and a clear button — the affordance every
 * module's table filters through.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Cari...",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate/50 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-border-hairline focus:border-navy-deep focus:ring-2 focus:ring-navy-deep/10 rounded-radius-md pl-10 pr-9 py-2.5 min-h-[44px] text-navy-deep font-body text-body-md transition-all outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Bersihkan pencarian"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-slate/50 hover:text-navy-deep hover:bg-slate/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export type FilterOption<T extends string> = { value: T; label: string; count?: number };

/**
 * Pill-style filter group — used for status tabs (RFQ) and category filters.
 * The active pill is solid navy; counts ride along as a translucent badge.
 */
export function FilterPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center gap-1.5 px-space-3 py-2 min-h-[40px] rounded-full text-body-sm font-medium border transition-all duration-150 ${
              isActive
                ? "bg-navy-deep text-ivory border-navy-deep shadow-sm"
                : "bg-white text-slate border-border-hairline hover:border-navy-deep/30 hover:text-navy-deep"
            }`}
          >
            {option.label}
            {typeof option.count === "number" && (
              <span
                className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${
                  isActive ? "bg-white/20" : "bg-navy-deep/5"
                }`}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
