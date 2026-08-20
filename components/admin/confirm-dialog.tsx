"use client";

import { useEffect } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  isPending?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isPending = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isPending) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isPending]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-space-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm"
        onClick={() => !isPending && onClose()}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative bg-white rounded-radius-md shadow-card w-full max-w-md p-space-6 md:p-space-8 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <h2 id="dialog-title" className="font-display font-medium text-display-md text-navy-deep mb-space-3">
          {title}
        </h2>
        <div className="font-body text-body-md text-slate mb-space-8">
          {message}
        </div>
        
        <div className="flex items-center justify-end gap-space-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-space-4 py-space-2 rounded-radius-sm font-body font-medium text-body-sm text-slate hover:bg-slate/10 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-space-4 py-space-2 rounded-radius-sm font-body font-medium text-body-sm bg-red-signal text-ivory hover:bg-red-signal/90 transition-colors disabled:opacity-50 min-w-[100px] flex justify-center"
          >
            {isPending ? (
              <svg className="animate-spin h-5 w-5 text-ivory" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
