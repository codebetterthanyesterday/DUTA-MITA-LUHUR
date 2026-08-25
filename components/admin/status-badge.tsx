import React from "react";
import { RfqStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: RfqStatus | "ALL";
}

const CONFIG: Record<RfqStatus | "ALL", { label: string; classes: string; dot: string }> = {
  NEW: {
    label: "Baru",
    classes: "bg-red-signal/10 text-red-signal border-red-signal/25",
    dot: "bg-red-signal",
  },
  IN_PROGRESS: {
    label: "Diproses",
    classes: "bg-gold-hairline/10 text-gold-hairline border-gold-hairline/35",
    dot: "bg-gold-hairline",
  },
  CLOSED: {
    label: "Selesai",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-600",
  },
  ALL: {
    label: "Semua",
    classes: "bg-navy-deep text-ivory border-navy-deep",
    dot: "bg-ivory",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border whitespace-nowrap ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
}
