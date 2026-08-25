import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Header shared by every admin module page: back link (optional), title,
 * description, and a slot for primary actions. Keeps list and form pages
 * visually consistent across the portal.
 */
export function PageHeader({
  title,
  description,
  backHref,
  backLabel = "Kembali",
  actions,
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate/10 pb-6 mb-8 relative">
      {/* Subtle background glow effect behind the header */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent -z-10 blur-xl pointer-events-none" />
      
      {backHref && (
        <Link
          href={backHref}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate hover:text-navy-deep transition-colors mb-4 min-h-[44px]"
        >
          <div className="w-8 h-8 rounded-full bg-slate/5 group-hover:bg-slate/10 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
          </div>
          {backLabel}
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="font-display font-semibold text-3xl tracking-tight text-navy-deep truncate">
            {title}
          </h1>
          {description && (
            <p className="font-body text-base text-slate mt-2 max-w-2xl leading-relaxed">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0 pb-1">{actions}</div>}
      </div>
    </div>
  );
}
