import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-navy-deep text-white hover:bg-navy-base shadow-sm hover:shadow-md border border-transparent",
  secondary: "text-slate bg-slate/5 hover:bg-slate/10 hover:text-navy-deep border border-slate/10",
  danger: "bg-red-signal text-white hover:bg-red-signal/90 shadow-sm hover:shadow-md border border-transparent",
};

/**
 * Shared submit/cancel button. `pending` swaps the label for a spinner while
 * holding the button's width so the layout doesn't jump mid-submit.
 */
export function Button({
  children,
  variant = "primary",
  pending = false,
  type = "button",
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  pending?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || pending}
      className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] rounded-radius-lg font-body font-medium text-sm transition-all active:scale-[0.98] duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-navy-deep/20 focus:ring-offset-1 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
