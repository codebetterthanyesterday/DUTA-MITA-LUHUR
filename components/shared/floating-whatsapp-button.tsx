import React from "react";
import type { BlockData } from "@/lib/content/blocks";
import { WhatsappLink } from "./whatsapp-link";

interface FloatingWhatsappButtonProps {
  isAdmin: boolean;
  contact: BlockData<"site.contact">;
}

export function FloatingWhatsappButton({ isAdmin, contact }: FloatingWhatsappButtonProps) {
  return (
    <WhatsappLink
      contact={contact}
      isAdmin={isAdmin}
      ariaLabel="Chat WhatsApp"
      // PBI-20: Conditional positioning to avoid AdminBar
      // AdminBar is fixed at bottom-space-4 right-space-4 (bottom-4 right-4 or similar)
      // We will place this above AdminBar if isAdmin is true, else normal bottom-right
      className={`fixed right-space-4 z-40 flex items-center justify-center gap-space-2 bg-red-signal hover:bg-red-signal/90 text-ivory rounded-radius-md shadow-card-hover transition-all min-h-[44px] min-w-[44px] px-3 md:px-space-4 py-space-2
        ${isAdmin ? "bottom-[calc(5rem+env(safe-area-inset-bottom))]" : "bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"}
      `}
    >
      <svg
        className="w-5 h-5 shrink-0"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814h.005c3.18 0 5.767-2.586 5.768-5.766 0-1.54-.6-2.987-1.689-4.078-1.09-1.089-2.538-1.722-4.084-1.722zm0-2.172c2.094 0 4.062.815 5.542 2.296 1.48 1.48 2.296 3.448 2.296 5.543 0 4.322-3.518 7.84-7.839 7.84-1.328 0-2.614-.337-3.754-.977l-4.276 1.121 1.141-4.172c-.703-1.189-1.074-2.551-1.073-3.947.001-4.321 3.518-7.839 7.84-7.839zm0 13.914c1.157 0 2.29-.311 3.279-.899l.235-.14 2.438.64-.651-2.376.153-.244c.646-1.028.987-2.222.987-3.454-.001-3.328-2.709-6.036-6.038-6.036-1.613 0-3.129.628-4.27 1.769-1.141 1.141-1.769 2.658-1.769 4.271 0 3.329 2.708 6.037 6.037 6.037z" />
      </svg>
      {/* Show text on md and up, hide on smaller screens */}
      <span className="hidden md:inline font-body font-medium text-body-sm whitespace-nowrap">
        Chat WhatsApp
      </span>
    </WhatsappLink>
  );
}