export function TrustStats() {
  // TODO: confirm exact production and export numbers with client
  const stats = [
    { value: "150+", label: "Ton produksi / bulan" },
    { value: "12", label: "Negara tujuan ekspor" },
    { value: "ISO 9001", label: "Sertifikasi kualitas" },
    { value: "15+", label: "Tahun pengalaman" },
  ];

  return (
    <section className="bg-navy-base text-ivory border-b border-slate/20">
      <div className="max-w-7xl mx-auto px-space-4 md:px-space-6 py-space-4">
        {/* Desktop 4-col flex/grid, Mobile 2x2 grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate/30">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`p-space-3 ${
                index % 2 !== 0 ? "pl-space-4 sm:pl-space-4" : ""
              } flex flex-col justify-center`}
            >
              <span className="font-mono font-medium text-display-md text-ivory">
                {stat.value}
              </span>
              <span className="font-body text-caption text-ivory/60 mt-space-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
