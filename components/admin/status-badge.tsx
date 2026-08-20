import React from "react";
import { RfqStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: RfqStatus | "ALL";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "NEW") {
    return (
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-red-signal/10 text-red-signal border border-red-signal/30 whitespace-nowrap">
        Baru
      </span>
    );
  }

  if (status === "IN_PROGRESS") {
    return (
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-gold-hairline/10 text-gold-hairline border border-gold-hairline/40 whitespace-nowrap">
        Diproses
      </span>
    );
  }

  if (status === "CLOSED") {
    return (
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-slate/10 text-slate border border-slate/30 whitespace-nowrap">
        Selesai
      </span>
    );
  }

  if (status === "ALL") {
    return (
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-navy-deep text-ivory border border-navy-deep whitespace-nowrap">
        Semua
      </span>
    );
  }

  return null;
}
