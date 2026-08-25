import type { BlockData } from "@/lib/content/blocks";
import { whatsappUrl } from "@/lib/content/contact";

/**
 * Wraps a WhatsApp deep link, shared by the floating button, the footer, and
 * the contact page.
 *
 * Admin accounts manage the business side of the site rather than being a
 * customer of it — consistent with the RFQ and contact form being disabled
 * for admins, starting a WhatsApp chat to the company's own number makes no
 * sense either, so it degrades to a disabled, explained state instead of a
 * live link.
 */
export function WhatsappLink({
  contact,
  isAdmin,
  className,
  ariaLabel,
  children,
}: {
  contact: BlockData<"site.contact">;
  isAdmin: boolean;
  className: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  if (isAdmin) {
    return (
      <span
        aria-disabled="true"
        aria-label={ariaLabel}
        title="Tidak tersedia untuk akun admin"
        className={`${className} opacity-50 grayscale cursor-not-allowed`}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={whatsappUrl(contact)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}
