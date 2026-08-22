"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

export function AdminNav() {
  const segments = useSelectedLayoutSegments();
  const upLevels = Math.max(0, segments.length - 1);
  const prefix = upLevels > 0 ? "../".repeat(upLevels) : "./";

  return (
    <nav className="flex-grow p-space-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
      <Link
        href={prefix === "./" ? "./" : prefix}
        className="flex-shrink-0 px-space-3 py-space-2 rounded-radius-sm text-body-sm font-medium hover:bg-slate/10 transition-colors"
      >
        Dashboard
      </Link>
      <Link
        href={`${prefix}products`}
        className="flex-shrink-0 px-space-3 py-space-2 rounded-radius-sm text-body-sm font-medium hover:bg-slate/10 transition-colors"
      >
        Produk
      </Link>
      <Link
        href={`${prefix}categories`}
        className="flex-shrink-0 px-space-3 py-space-2 rounded-radius-sm text-body-sm font-medium hover:bg-slate/10 transition-colors"
      >
        Kategori
      </Link>
      <Link
        href={`${prefix}rfq`}
        className="flex-shrink-0 px-space-3 py-space-2 rounded-radius-sm text-body-sm font-medium hover:bg-slate/10 transition-colors"
      >
        RFQ
      </Link>
    </nav>
  );
}
