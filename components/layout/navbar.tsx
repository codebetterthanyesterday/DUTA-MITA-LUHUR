"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "./nav-links";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 bg-ivory border-b border-border-hairline">
      <div className="max-w-7xl mx-auto px-space-4 md:px-space-6 py-space-3 flex items-center justify-between">
        {/* Wordmark Logo */}
        <Link
          href="/"
          className="font-display font-medium text-display-md text-navy-deep hover:opacity-90 transition-opacity"
        >
          Duta Mitra Luhur
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-space-4"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-body-sm font-medium transition-colors pb-0.5 border-b ${isActive
                    ? "text-red-signal border-gold-hairline"
                    : "text-slate hover:text-navy-deep border-transparent"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

          {/* Desktop CTA Button */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/rfq"
            className="bg-red-signal hover:bg-red-signal/90 text-ivory px-space-3 py-space-1 rounded-radius-sm font-body font-medium text-body-sm transition-colors"
          >
            Ajukan Penawaran
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="lg:hidden p-space-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-navy-deep hover:text-red-signal transition-colors focus:outline-none"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Slide-down/Dropdown Panel */}
      {isOpen && (
        <div className="lg:hidden bg-navy-deep text-ivory border-t border-slate/20 px-space-4 py-space-6 pb-[env(safe-area-inset-bottom)] min-h-[calc(100vh-65px)] overflow-y-auto flex flex-col justify-between">
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-space-3">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-body text-body-lg py-space-1 border-b transition-colors ${isActive
                      ? "text-red-signal border-gold-hairline font-medium"
                      : "text-ivory/80 hover:text-ivory border-slate/20"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-space-6 border-t border-slate/30 mt-space-6">
            <Link
              href="/rfq"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-red-signal hover:bg-red-signal/90 text-ivory py-space-2 rounded-radius-sm font-body font-medium text-body-md transition-colors"
            >
              Ajukan Penawaran
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
