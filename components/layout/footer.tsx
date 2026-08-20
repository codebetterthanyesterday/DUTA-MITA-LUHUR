import Link from "next/link";
import { NAV_LINKS } from "./nav-links";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep text-ivory pt-space-12 pb-[calc(3rem+env(safe-area-inset-bottom))] px-space-4 md:px-space-6 border-t border-slate/30">
      <div className="max-w-7xl mx-auto">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-space-6 md:gap-space-8 pb-space-8">
          {/* Column 1 — Company */}
          <div className="space-y-space-3">
            <span className="font-display font-medium text-display-md text-ivory block">
              Duta Mitra Luhur
            </span>
            <p className="font-body text-body-sm text-slate max-w-sm">
              {/* TODO: replace with real company description */}
              Produsen dan eksportir produk karet alam dan olahan industri berkualitas tinggi dari Indonesia untuk pasar manufaktur global.
            </p>
            <div className="pt-space-1">
              <a
                href="https://wa.me/62XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-space-2 bg-red-signal hover:bg-red-signal/90 text-ivory px-space-3 py-space-1 rounded-radius-sm font-body font-medium text-body-sm transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814h.005c3.18 0 5.767-2.586 5.768-5.766 0-1.54-.6-2.987-1.689-4.078-1.09-1.089-2.538-1.722-4.084-1.722zm0-2.172c2.094 0 4.062.815 5.542 2.296 1.48 1.48 2.296 3.448 2.296 5.543 0 4.322-3.518 7.84-7.839 7.84-1.328 0-2.614-.337-3.754-.977l-4.276 1.121 1.141-4.172c-.703-1.189-1.074-2.551-1.073-3.947.001-4.321 3.518-7.839 7.84-7.839zm0 13.914c1.157 0 2.29-.311 3.279-.899l.235-.14 2.438.64-.651-2.376.153-.244c.646-1.028.987-2.222.987-3.454-.001-3.328-2.709-6.036-6.038-6.036-1.613 0-3.129.628-4.27 1.769-1.141 1.141-1.769 2.658-1.769 4.271 0 3.329 2.708 6.037 6.037 6.037z" />
                </svg>
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2 — Navigasi */}
          <div>
            <h3 className="font-display font-medium text-display-md text-ivory mb-space-3">
              Navigasi
            </h3>
            <ul className="space-y-space-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-body-sm text-slate hover:text-ivory transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Kontak */}
          <div>
            <h3 className="font-display font-medium text-display-md text-ivory mb-space-3">
              Kontak
            </h3>
            <ul className="space-y-space-3 font-body text-body-sm text-slate">
              <li className="flex items-start gap-space-2">
                <svg
                  className="w-4 h-4 text-gold-hairline shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Kawasan Industri Estate, Surabaya, Jawa Timur, Indonesia</span>
              </li>
              <li className="flex items-center gap-space-2">
                <svg
                  className="w-4 h-4 text-gold-hairline shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>info@dutaMitraluhur.com</span>
              </li>
              <li className="flex items-center gap-space-2">
                <svg
                  className="w-4 h-4 text-gold-hairline shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+62 (31) 555-0199</span>
              </li>
            </ul>
          </div>

          {/* Column 4 — Sertifikasi/Legal */}
          <div>
            <h3 className="font-display font-medium text-display-md text-ivory mb-space-3">
              Sertifikasi &amp; Standar
            </h3>
            <p className="font-body text-body-sm text-slate mb-space-3">
              Kepatuhan standar mutu internasional untuk pasar ekspor.
            </p>
            {/* TODO: PBI-06 will provide full certification data */}
            <div className="flex flex-wrap gap-space-2">
              <span className="border border-gold-hairline text-ivory px-space-2 py-0.5 rounded-radius-sm font-mono text-caption">
                ISO 9001:2015
              </span>
              <span className="border border-gold-hairline text-ivory px-space-2 py-0.5 rounded-radius-sm font-mono text-caption">
                SNI Standard
              </span>
              <span className="border border-gold-hairline text-ivory px-space-2 py-0.5 rounded-radius-sm font-mono text-caption">
                ASTM D2000
              </span>
              <span className="border border-gold-hairline text-ivory px-space-2 py-0.5 rounded-radius-sm font-mono text-caption">
                SIR 20
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate/30 pt-space-4 flex flex-col sm:flex-row justify-between items-center gap-space-2 font-body text-body-sm text-slate">
          <p>© {currentYear} Duta Mitra Luhur. All rights reserved.</p>
          <div className="flex items-center gap-space-3">
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-slate hover:text-ivory transition-colors p-space-1"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-slate hover:text-ivory transition-colors p-space-1"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
