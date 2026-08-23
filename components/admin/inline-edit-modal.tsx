"use client";

import { useEffect } from "react";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-space-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-deep/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="relative bg-ivory w-full max-w-3xl max-h-[90vh] flex flex-col rounded-radius-md shadow-card overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="px-space-5 py-space-4 border-b border-slate/10 flex justify-between items-center bg-white shrink-0">
          <h2 id="modal-title" className="font-display font-medium text-display-md text-navy-deep">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate hover:text-navy-deep transition-colors p-2 -mr-2"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-space-5 bg-ivory">
          {children}
        </div>
      </div>
    </div>
  );
}
