"use client";

import { useEffect } from "react";
import { AlertTriangle, HelpCircle, Loader2 } from "lucide-react";

export type ConfirmVariant = "danger" | "default";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  isPending?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isPending = false,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "danger",
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

  const isDanger = variant === "danger";
  const Icon = isDanger ? AlertTriangle : HelpCircle;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-space-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm animate-admin-fade-in"
        onClick={() => !isPending && onClose()}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative bg-white rounded-radius-md shadow-card-hover w-full max-w-md max-h-[90dvh] overflow-y-auto p-space-6 md:p-space-8 animate-admin-pop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center mb-space-4 ${
            isDanger ? "bg-red-signal/10" : "bg-navy-deep/10"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${isDanger ? "text-red-signal" : "text-navy-deep"}`}
            aria-hidden="true"
          />
        </div>
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
            className="px-space-4 py-space-2 rounded-radius-sm font-body font-medium text-body-sm text-slate hover:bg-slate/10 transition-colors disabled:opacity-50 min-h-[44px]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`px-space-4 py-space-2 rounded-radius-sm font-body font-medium text-body-sm text-ivory transition-colors disabled:opacity-50 min-w-[100px] min-h-[44px] flex items-center justify-center gap-2 ${
              isDanger ? "bg-red-signal hover:bg-red-signal/90" : "bg-navy-deep hover:bg-navy-base"
            }`}
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
