import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-radius-md shadow-card border border-border-hairline p-space-8 md:p-space-10 text-center">
      <div className="w-12 h-12 rounded-full bg-ivory flex items-center justify-center mx-auto mb-space-3">
        <Icon className="w-6 h-6 text-slate/50" aria-hidden="true" />
      </div>
      <h3 className="font-display font-medium text-display-sm text-navy-deep mb-1">{title}</h3>
      {description && (
        <p className="font-body text-body-sm text-slate max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-space-4">{action}</div>}
    </div>
  );
}
