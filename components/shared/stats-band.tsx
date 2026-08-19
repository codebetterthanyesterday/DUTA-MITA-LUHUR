type StatItem = {
  value: string;
  label: string;
};

type StatsBandProps = {
  stats: StatItem[];
  className?: string; // Allow overriding the outer section class (e.g. bg-navy-base vs bg-navy-deep)
};

export function StatsBand({ stats, className = "bg-navy-base text-ivory border-b border-slate/20" }: StatsBandProps) {
  return (
    <section className={className}>
      <div className="max-w-7xl mx-auto px-space-4 md:px-space-6 py-space-4">
        {/* Desktop flex/grid, Mobile 2x2 grid (or auto wrapping depending on count) */}
        <div className={`grid grid-cols-2 sm:grid-cols-${stats.length} divide-y sm:divide-y-0 sm:divide-x divide-slate/30`}>
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
