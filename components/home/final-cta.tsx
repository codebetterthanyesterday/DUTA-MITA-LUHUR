import Link from "next/link";

export function FinalCta() {
  return (
    <section className="bg-navy-deep text-ivory py-space-12 px-space-4 md:px-space-6 text-center border-t border-slate/20">
      <div className="max-w-3xl mx-auto space-y-space-4">
        <span className="font-mono text-caption text-gold-hairline uppercase tracking-wider block">
          MULAI KEMITRAAN EKSPOR
        </span>

        <h2 className="font-display font-medium text-display-lg text-ivory leading-tight">
          Siap Memenuhi Kebutuhan Pasokan Karet Industri Anda
        </h2>

        <p className="font-body text-body-md text-ivory/75 max-w-xl mx-auto">
          Hubungi tim perdagangan internasional kami untuk konsultasi spesifikasi teknis, alokasi kuota pengiriman, dan penawaran harga kompetitif FOB/CIF.
        </p>

        <div className="pt-space-2">
          <Link
            href="/kontak"
            className="inline-block bg-red-signal hover:bg-red-signal/90 text-ivory px-space-6 py-space-2 rounded-radius-sm font-body font-medium text-body-md transition-colors"
          >
            Ajukan Penawaran Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
