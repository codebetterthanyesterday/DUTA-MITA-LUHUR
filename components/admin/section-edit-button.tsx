"use client";

import { Pencil } from "lucide-react";

type SectionEditButtonProps = {
  onClick: () => void;
  label?: string;
  className?: string;
};

export function SectionEditButton({ onClick, label = "Edit Bagian", className = "" }: SectionEditButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`absolute top-space-4 right-space-4 z-40 flex items-center gap-2 bg-navy-deep text-ivory px-space-3 py-1.5 rounded-radius-sm shadow-md hover:bg-navy-base transition-colors border border-navy-base/20 ${className}`}
      aria-label={label}
    >
      <Pencil className="w-4 h-4" />
      <span className="font-body text-body-sm font-medium">{label}</span>
    </button>
  );
}
