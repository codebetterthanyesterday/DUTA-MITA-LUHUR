"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AdminNav } from "./admin-nav";

const COLLAPSE_STORAGE_KEY = "dml-admin-sidebar-collapsed";

/**
 * Responsive shell for the admin portal.
 *
 * - Below md: the sidebar is an off-canvas drawer triggered by a fixed top bar,
 *   with a backdrop and Escape-to-close.
 * - md and up: the sidebar is persistent and can be collapsed to an icon rail,
 *   a preference remembered per-browser via localStorage.
 */
export function AdminShell({
  adminSlug,
  userEmail,
  children,
}: {
  adminSlug: string;
  userEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_STORAGE_KEY) === "1");
    } catch {
      // Private browsing / storage disabled — default to expanded.
    }
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Escape closes the mobile drawer.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Ignore — not critical if the preference doesn't persist.
      }
      return next;
    });
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push(`/${adminSlug}/login`);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-ivory text-navy-deep">
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-navy-deep text-ivory flex items-center justify-between px-space-4 border-b border-ivory/10">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Buka menu admin"
          aria-expanded={mobileOpen}
          className="flex items-center justify-center w-10 h-10 -ml-2 rounded-radius-sm hover:bg-ivory/10 transition-colors"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        <Link
          href={`/${adminSlug}`}
          className="font-display font-medium text-body-md hover:opacity-90 transition-opacity"
        >
          DML Admin
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Keluar"
          className="flex items-center justify-center w-10 h-10 -mr-2 rounded-radius-sm text-ivory/80 hover:text-red-signal hover:bg-ivory/10 transition-colors"
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
        </button>
      </header>

      {/* Backdrop (mobile drawer only) */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className={`md:hidden fixed inset-0 z-40 bg-navy-deep/60 backdrop-blur-sm transition-opacity duration-200 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen
          w-72 ${collapsed ? "md:w-[76px]" : "md:w-64"}
          bg-navy-deep text-ivory
          flex flex-col
          transition-transform md:transition-[width] duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* Sidebar header */}
        <div className="h-14 md:h-16 shrink-0 flex items-center justify-between px-space-4 border-b border-ivory/10">
          <Link
            href={`/${adminSlug}`}
            className={`font-display font-medium text-display-sm hover:opacity-90 transition-opacity truncate ${
              collapsed ? "md:hidden" : ""
            }`}
          >
            DML Admin
          </Link>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
            className="md:hidden flex items-center justify-center w-9 h-9 -mr-1.5 rounded-radius-sm hover:bg-ivory/10 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Perluas menu" : "Ciutkan menu"}
            title={collapsed ? "Perluas menu" : "Ciutkan menu"}
            className={`hidden md:flex items-center justify-center w-8 h-8 rounded-radius-sm text-ivory/60 hover:text-ivory hover:bg-ivory/10 transition-colors ${
              collapsed ? "mx-auto" : ""
            }`}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <AdminNav
          adminSlug={adminSlug}
          collapsed={collapsed}
          onNavigate={() => setMobileOpen(false)}
        />

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-ivory/10 p-space-3">
          <div
            className={`flex items-center gap-space-2 mb-space-2 px-space-1 ${
              collapsed ? "md:justify-center md:mb-0" : ""
            }`}
          >
            <span
              className="w-7 h-7 rounded-full bg-red-signal/20 text-red-signal flex items-center justify-center text-caption font-semibold shrink-0"
              aria-hidden="true"
            >
              {userEmail.charAt(0).toUpperCase()}
            </span>
            <span className={`min-w-0 flex-1 ${collapsed ? "md:hidden" : ""}`}>
              <span className="block text-body-sm text-ivory truncate">{userEmail}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Keluar" : undefined}
            className={`
              hidden md:flex items-center gap-space-2 w-full
              px-space-3 py-space-2 rounded-radius-md
              text-body-sm font-medium text-ivory/75
              hover:text-ivory hover:bg-navy-base/50 transition-colors
              ${collapsed ? "md:justify-center md:px-space-2" : ""}
            `}
          >
            <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className={collapsed ? "md:hidden" : ""}>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`
          min-h-screen pt-14 md:pt-0
          transition-[margin] duration-300 ease-out
          ${collapsed ? "md:ml-[76px]" : "md:ml-64"}
        `}
      >
        {children}
      </main>
    </div>
  );
}
