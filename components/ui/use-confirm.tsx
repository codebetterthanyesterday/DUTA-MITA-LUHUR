"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { ConfirmDialog, ConfirmVariant } from "./confirm-dialog";

type ConfirmOptions = {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const settle = (result: boolean) => {
    setOptions(null);
    resolveRef.current?.(result);
    resolveRef.current = null;
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        isOpen={options !== null}
        onClose={() => settle(false)}
        onConfirm={() => settle(true)}
        title={options?.title ?? ""}
        message={options?.message ?? ""}
        confirmLabel={options?.confirmLabel}
        cancelLabel={options?.cancelLabel}
        variant={options?.variant}
      />
    </ConfirmContext.Provider>
  );
}

/** Promise-based replacement for `window.confirm`: `if (!(await confirm({ ... }))) return;` */
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within a ConfirmProvider");
  return ctx;
}
