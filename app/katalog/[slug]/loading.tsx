export default function ProductDetailLoading() {
  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-space-4 md:px-space-6 py-space-6 md:py-space-8">
        
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-64 bg-slate/10 rounded animate-pulse mb-space-6"></div>

        {/* 2-Column Main Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-space-6 lg:gap-space-8 mb-space-12">
          
          {/* Left Column: Image Gallery Skeleton */}
          <div className="space-y-space-3">
            {/* Main Image */}
            <div className="w-full aspect-[4/3] rounded-radius-md bg-slate/5 animate-pulse"></div>
            {/* Thumbnails */}
            <div className="flex gap-space-2 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 shrink-0 rounded-radius-sm bg-slate/5 animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Right Column: Info Panel Skeleton */}
          <div>
            <div className="space-y-space-4">
              {/* Category */}
              <div className="h-3 w-24 bg-slate/10 rounded animate-pulse"></div>
              
              {/* Title */}
              <div className="h-10 w-3/4 max-w-md bg-slate/10 rounded animate-pulse"></div>

              {/* Short Description */}
              <div className="space-y-2 py-space-2">
                <div className="h-4 w-full bg-slate/10 rounded animate-pulse"></div>
                <div className="h-4 w-11/12 bg-slate/10 rounded animate-pulse"></div>
                <div className="h-4 w-4/5 bg-slate/10 rounded animate-pulse"></div>
              </div>

              {/* Stat Block */}
              <div className="grid grid-cols-2 divide-x divide-slate/20 border border-slate/20 rounded-radius-md bg-white mt-space-6 mb-space-6 h-20">
                <div className="p-space-3 flex flex-col justify-center">
                  <div className="h-3 w-12 bg-slate/10 rounded animate-pulse mb-2"></div>
                  <div className="h-5 w-24 bg-slate/10 rounded animate-pulse"></div>
                </div>
                <div className="p-space-3 flex flex-col justify-center">
                  <div className="h-3 w-16 bg-slate/10 rounded animate-pulse mb-2"></div>
                  <div className="h-5 w-32 bg-slate/10 rounded animate-pulse"></div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-space-3 pt-space-2">
                <div className="w-full h-12 bg-slate/10 rounded-radius-sm animate-pulse"></div>
                <div className="w-full h-8 bg-slate/10 rounded animate-pulse mx-auto max-w-sm"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
