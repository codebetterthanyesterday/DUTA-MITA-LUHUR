"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type ToastVariant = "success" | "error";
type ToastItem = { id: number; message: string; variant: ToastVariant };

type ToastFn = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastFn | null>(null);

const DURATION_MS: Record<ToastVariant, number> = { success: 3500, error: 5500 };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = nextId.current++;
      setToasts((prev) => [{ id, message, variant }, ...prev]);
      setTimeout(() => dismiss(id), DURATION_MS[variant]);
    },
    [dismiss]
  );

  const api = useMemo<ToastFn>(
    () => ({
      success: (message: string) => push("success", message),
      error: (message: string) => push("error", message),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const isError = toast.variant === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;
  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={`pointer-events-auto animate-admin-slide-right flex items-start gap-space-3 bg-white rounded-radius-md shadow-card-hover border-l-4 p-space-4 ${
        isError ? "border-red-signal" : "border-emerald-600"
      }`}
    >
      <Icon
        className={`w-5 h-5 shrink-0 mt-0.5 ${isError ? "text-red-signal" : "text-emerald-600"}`}
        aria-hidden="true"
      />
      <p className="font-body text-body-sm text-navy-deep flex-1 min-w-0">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-slate hover:text-navy-deep transition-colors -m-1 p-1"
        aria-label="Tutup notifikasi"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function useToast(): ToastFn {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
