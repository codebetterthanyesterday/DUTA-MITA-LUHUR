import { PanelSkeleton } from "@/components/admin/dashboard/panels";

export default function AdminLoading() {
  return (
    <div className="p-space-4 md:p-space-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* Page Header Skeleton */}
      <header className="border-b border-border-hairline pb-space-4 mb-space-6 flex flex-col sm:flex-row sm:items-center justify-between gap-space-4">
        <div className="space-y-space-2 w-full max-w-md">
          <div className="h-8 bg-slate/10 rounded-radius-sm animate-pulse w-1/2"></div>
          <div className="h-4 bg-slate/10 rounded-radius-sm animate-pulse w-3/4"></div>
        </div>
        <div className="h-11 w-full sm:w-32 bg-slate/10 rounded-radius-md animate-pulse shrink-0"></div>
      </header>

      {/* Content Skeleton */}
      <div className="space-y-space-6">
        {/* Toolbar / Filters Skeleton */}
        <div className="flex flex-col sm:flex-row gap-space-3">
          <div className="h-11 bg-slate/10 rounded-radius-md animate-pulse w-full sm:max-w-xs"></div>
          <div className="h-11 bg-slate/10 rounded-radius-md animate-pulse w-full sm:max-w-xs"></div>
        </div>
        
        {/* Main Panel Skeleton */}
        <div className="bg-white rounded-radius-md shadow-card border border-border-hairline p-space-4 md:p-space-6">
          <PanelSkeleton lines={6} />
        </div>
      </div>
    </div>
  );
}
