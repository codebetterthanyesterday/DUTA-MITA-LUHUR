import type { BlockData } from "./blocks";

/**
 * Build the wa.me link for the company's WhatsApp number.
 *
 * The number and the pre-filled greeting both live in the `site.contact` block,
 * so the footer, the contact page, and the floating button can never drift out
 * of sync the way the previously hard-coded copies did.
 */
export function whatsappUrl(
  contact: Pick<BlockData<"site.contact">, "whatsappNumber" | "whatsappMessage">
): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    contact.whatsappMessage
  )}`;
}
