import type { LucideIcon } from "lucide-react";

/**
 * Card wrapper for one logical group of fields inside a create/edit form.
 * The icon badge + title pattern gives each section a distinct visual
 * anchor, so a long form reads as a sequence of clear steps rather than one
 * undifferentiated block.
 */
export function SectionCard({
  icon: Icon,
  title,
  description,
  action,
  children,
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-white/60 backdrop-blur-md rounded-radius-lg shadow-[0_4px_16px_rgba(11,30,58,0.03)] border border-white/40 ring-1 ring-slate/5 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(11,30,58,0.06)] ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate/10 bg-gradient-to-r from-white/80 to-transparent">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-full bg-navy-deep/5 flex items-center justify-center shrink-0 shadow-sm border border-navy-deep/5">
            <Icon className="w-5 h-5 text-navy-deep" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-semibold text-lg text-navy-deep leading-tight">
              {title}
            </h2>
            {description && (
              <p className="font-body text-sm text-slate mt-1">{description}</p>
            )}
          </div>
        </div>
        {action && (
          <div className="flex-shrink-0 mt-3 sm:mt-0">
            {action}
          </div>
        )}
      </div>
      <div className="p-6 md:p-8">
        {children}
      </div>
    </section>
  );
}
