"use client";

import { useEffect } from "react";
import Image from "next/image";

type LightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
};

export function Lightbox({ isOpen, onClose, imageUrl, altText }: LightboxProps) {
  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-navy-deep/90 flex items-center justify-center p-space-4 sm:p-space-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 text-ivory/70 hover:text-ivory bg-navy-deep/50 hover:bg-navy-deep/80 rounded-radius-sm transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close lightbox"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={altText}
            fill
            sizes="100vw"
            className="object-contain shadow-card-hover rounded-radius-sm"
          />
        ) : (
          <div className="w-full max-w-4xl aspect-[4/3] bg-navy-base/5 border border-border-hairline rounded-radius-md flex flex-col items-center justify-center p-space-6 text-center shadow-card-hover">
            <span className="font-mono text-body-md text-slate/80 uppercase">
              {altText}
            </span>
            <span className="font-mono text-caption text-slate/50 mt-2">
              Preview Mode
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
