import Link from "next/link";

export function Hero() {
  return (
    <section className="relative bg-navy-deep text-ivory overflow-hidden py-space-8 md:py-space-12 px-space-4 md:px-space-6 border-b border-slate/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-space-6 lg:gap-space-8 items-center">
        {/* Left Column: Core Narrative */}
        <div className="z-10 space-y-space-3">
          <span className="inline-block font-mono text-caption uppercase tracking-wider text-gold-hairline">
            RUBBER EXPORT — TRUSTED INDUSTRIAL PARTNER
          </span>

          <h1 className="font-display font-medium text-display-xl text-ivory max-w-[520px] leading-[1.15]">
            Indonesian Natural Rubber Engineered for Global Industry
          </h1>

          <p className="font-body text-body-lg text-ivory/70 max-w-[440px] pt-space-1">
            PT Duta Mitra Luhur memproduksi dan mengekspor polimer karet alam berstandar internasional dengan jaminan konsistensi mutu teknis dan ketepatan logistik global.
          </p>

          <div className="flex flex-wrap items-center gap-space-2 pt-space-3">
            <Link
              href="/katalog"
              className="bg-red-signal hover:bg-red-signal/90 text-ivory px-space-3 py-space-1 rounded-radius-sm font-body font-medium text-body-sm transition-colors"
            >
              Lihat Katalog Produk
            </Link>
            <Link
              href="/kontak"
              className="border border-ivory/35 hover:bg-ivory/10 text-ivory px-space-3 py-space-1 rounded-radius-sm font-body font-medium text-body-sm transition-colors"
            >
              Ajukan Penawaran
            </Link>
          </div>
        </div>

        {/* Right Column / Visual Accent (Export Routes Signature) */}
        <div className="relative flex items-center justify-center lg:justify-end py-space-4 lg:py-0">
          <div className="w-full max-w-[380px] lg:max-w-none opacity-60">
            <svg
              viewBox="0 0 400 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              aria-hidden="true"
            >
              <path
                d="M20,160 Q120,40 200,90 T380,30"
                fill="none"
                stroke="#C9A15A"
                strokeWidth="1.5"
                strokeDasharray="2,6"
                strokeLinecap="round"
              />
              <circle cx="20" cy="160" r="4" fill="#D81F3C" />
              <circle cx="200" cy="90" r="3" fill="#C9A15A" />
              <circle cx="380" cy="30" r="4" fill="#D81F3C" />
            </svg>
            <div className="flex justify-between items-center px-space-2 font-mono text-caption text-ivory/40 mt-space-1">
              <span>Origin: Indonesia</span>
              <span>Hub: Port of Tanjung Perak</span>
              <span>Global Destinations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
