import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Tone = "default" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
  default: "text-slate hover:text-navy-deep hover:bg-navy-deep/5",
  danger: "text-slate hover:text-red-signal hover:bg-red-signal/10",
};

const baseClasses =
  "inline-flex items-center justify-center w-11 h-11 rounded-radius-sm transition-colors shrink-0 active:scale-95 duration-150";

/**
 * 44px icon-only affordance shared by every table row and toolbar — a link
 * variant for navigation (Edit) and a button variant for in-place actions
 * (Delete). Always carries a visible tooltip title and an aria-label so the
 * icon-only presentation stays accessible.
 */
export function IconButton({
  icon: Icon,
  label,
  tone = "default",
  href,
  onClick,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  tone?: Tone;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const className = `${baseClasses} ${TONE_CLASSES[tone]} ${disabled ? "opacity-40 pointer-events-none" : ""}`;

  if (href) {
    return (
      <Link href={href} title={label} aria-label={label} className={className}>
        <Icon className="w-4 h-4" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
    </button>
  );
}
