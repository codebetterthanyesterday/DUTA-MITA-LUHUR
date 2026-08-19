export default function KatalogLoading() {
  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-space-4 md:px-space-6 py-space-8 md:py-space-12">
        {/* Header Skeleton */}
        <header className="mb-space-8">
          <div className="h-10 w-64 bg-slate/10 rounded animate-pulse mb-space-4"></div>
          <div className="h-4 w-full max-w-2xl bg-slate/10 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-3/4 max-w-xl bg-slate/10 rounded animate-pulse"></div>
        </header>

        {/* Explorer Skeleton */}
        <div className="space-y-space-6">
          {/* Search Input Skeleton */}
          <div className="h-12 w-full max-w-md bg-slate/10 rounded-radius-sm animate-pulse"></div>
          
          {/* Filter Pills Skeleton */}
          <div className="flex flex-wrap gap-space-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-24 bg-slate/10 rounded-radius-sm animate-pulse"></div>
            ))}
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-3 pt-space-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-ivory border border-border-hairline rounded-radius-md shadow-card p-space-3 flex flex-col h-[320px]"
              >
                {/* Image Placeholder */}
                <div className="aspect-[4/3] bg-slate/5 rounded-radius-sm mb-space-3 animate-pulse w-full"></div>
                {/* Text lines */}
                <div className="h-3 w-1/3 bg-slate/10 rounded animate-pulse mb-space-2"></div>
                <div className="h-5 w-3/4 bg-slate/10 rounded animate-pulse mb-space-4"></div>
                {/* Bottom line */}
                <div className="mt-auto pt-space-3 border-t border-border-hairline">
                  <div className="h-3 w-2/3 bg-slate/10 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
