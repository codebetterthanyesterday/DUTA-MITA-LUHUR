export function WhyUs() {
  const valueProps = [
    {
      title: "Kapasitas Pasokan Terukur",
      description:
        "Fasilitas pemrosesan terintegrasi menjamin kontinuitas volume pasokan polimer karet untuk kontrak jangka panjang pabrikan internasional.",
      icon: (
        <svg
          className="w-6 h-6 text-red-signal"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      title: "Kepatuhan Spesifikasi Teknis",
      description:
        "Pengujian parameter berkala memastikan kesesuaian ketat terhadap standar mutu ASTM D2000, ISO 9001, dan Standar Indonesian Rubber (SIR).",
      icon: (
        <svg
          className="w-6 h-6 text-red-signal"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Manajemen Logistik Ekspor",
      description:
        "Pengalaman menyeluruh dalam penerbitan Certificate of Analysis, kepatuhan kepabeanan, serta pengiriman kontainer tepat waktu ke seluruh dunia.",
      icon: (
        <svg
          className="w-6 h-6 text-red-signal"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-ivory py-space-8 px-space-4 md:px-space-6 border-b border-border-hairline">
      <div className="max-w-7xl mx-auto space-y-space-6">
        <div>
          <span className="font-mono text-caption uppercase tracking-wider text-slate block mb-space-1">
            Keunggulan Kompetitif
          </span>
          <h2 className="font-display font-medium text-display-lg text-navy-deep">
            Mengapa Memilih Duta Mita Luhur
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-6 md:gap-space-8 pt-space-2">
          {valueProps.map((prop) => (
            <div key={prop.title} className="space-y-space-2">
              <div className="w-10 h-10 rounded-radius-sm bg-navy-base/5 flex items-center justify-center">
                {prop.icon}
              </div>
              <h3 className="font-display font-medium text-display-md text-navy-deep">
                {prop.title}
              </h3>
              <p className="font-body text-body-md text-slate">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
