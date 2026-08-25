"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type InlineEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function InlineEditModal({ isOpen, onClose, title, children }: InlineEditModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-space-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm animate-admin-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal — bottom sheet on mobile, centered card from md up */}
      <div
        className="relative bg-ivory w-full max-w-3xl max-h-[92dvh] md:max-h-[90dvh] flex flex-col rounded-t-radius-lg md:rounded-radius-md shadow-card-hover overflow-hidden animate-admin-slide-up md:animate-admin-pop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Grab handle — mobile bottom-sheet affordance only */}
        <div className="shrink-0 flex justify-center pt-2 pb-1 md:hidden" aria-hidden="true">
          <div className="w-10 h-1.5 rounded-full bg-slate/25" />
        </div>

        <div className="px-space-3 py-space-2 md:px-space-4 md:py-space-3 border-b border-border-hairline flex justify-between items-center gap-space-2 bg-white shrink-0">
          <h2 id="modal-title" className="font-display font-medium text-display-md text-navy-deep truncate">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-11 h-11 -mr-2 shrink-0 flex items-center justify-center text-slate hover:text-red-signal hover:bg-red-signal/10 rounded-full transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-space-3 md:p-space-4 bg-ivory pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-space-4">
          {children}
        </div>
      </div>
    </div>
  );
}
