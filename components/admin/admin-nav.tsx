"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ClipboardList,
  Mail,
} from "lucide-react";

type NavItem = { path: string; label: string; icon: typeof LayoutDashboard };
type NavSection = { title?: string; items: NavItem[] };

const SECTIONS: NavSection[] = [
  {
    items: [
      { path: "", label: "Ringkasan", icon: LayoutDashboard },
      { path: "messages", label: "Pesan Kontak", icon: Mail },
    ],
  },
  {
    title: "Manajemen",
    items: [
      { path: "products", label: "Produk", icon: Package },
      { path: "categories", label: "Kategori", icon: FolderOpen },
      { path: "rfq", label: "RFQ", icon: ClipboardList },
    ],
  },
];

export function AdminNav({
  adminSlug,
  collapsed = false,
  onNavigate,
}: {
  adminSlug: string;
  /** Icon-only rail mode — only ever applied at md+ via responsive classes below. */
  collapsed?: boolean;
  /** Fired when a link is clicked, so the mobile drawer can close itself. */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden py-space-2"
      role="navigation"
      aria-label="Menu admin"
    >
      {SECTIONS.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          {section.title && (
            <p
              className={`px-space-4 py-space-2 mt-space-2 text-caption uppercase tracking-wider text-ivory/40 font-semibold whitespace-nowrap ${
                collapsed ? "md:hidden" : ""
              }`}
            >
              {section.title}
            </p>
          )}
          <ul className="space-y-0.5 px-space-2">
            {section.items.map(({ path, label, icon: Icon }) => {
              const href = `/${adminSlug}${path ? `/${path}` : ""}`;
              const isActive = path
                ? pathname === href || pathname.startsWith(`${href}/`)
                : pathname === href;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    title={collapsed ? label : undefined}
                    className={`
                      flex items-center gap-space-3 px-space-3 py-space-2
                      rounded-radius-md text-body-sm font-medium
                      border-l-2 transition-all duration-150
                      min-h-[44px]
                      ${collapsed ? "md:justify-center md:px-space-2" : ""}
                      ${
                        isActive
                          ? "bg-red-signal/15 text-ivory border-l-red-signal"
                          : "text-ivory/75 border-l-transparent hover:text-ivory hover:bg-navy-base/50"
                      }
                    `}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? "text-red-signal" : "text-ivory/60"
                      }`}
                      aria-hidden="true"
                    />
                    <span className={`truncate ${collapsed ? "md:hidden" : ""}`}>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
