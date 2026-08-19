"use client";

import { useState, useEffect } from "react";

type ProductImage = {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
};

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
  categoryName: string;
};

export function ProductGallery({ images, productName, categoryName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    if (isLightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  // If no images exist, fallback to a single placeholder
  const activeImage = images.length > 0 ? images[activeIndex] : null;
  const hasError = imageError[activeIndex];

  const renderPlaceholder = (text: string = "Spesimen Produk", subtext: string = categoryName) => (
    <div className="flex flex-col items-center justify-center p-space-2 text-center w-full h-full bg-navy-base/5 border border-border-hairline">
      <span className="font-mono text-caption uppercase text-slate/70">
        {text}
      </span>
      <span className="font-mono text-caption text-slate/50 mt-0.5">
        {subtext}
      </span>
    </div>
  );

  return (
    <div className="space-y-space-3">
      {/* Main Image Area */}
      <button
        type="button"
        onClick={() => {
          if (activeImage && !hasError) setIsLightboxOpen(true);
        }}
        className={`relative w-full aspect-[4/3] rounded-radius-md overflow-hidden bg-navy-base/5 border border-border-hairline transition-colors ${
          activeImage && !hasError ? "cursor-zoom-in hover:bg-navy-base/10" : "cursor-default"
        }`}
        aria-label="View larger image"
      >
        {activeImage && !hasError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={activeImage.id} // Forces re-render for crossfade if needed
            src={activeImage.url}
            alt={activeImage.altText || productName}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ease-in-out opacity-0 animate-[fadeIn_150ms_ease-in-out_forwards]"
            onError={() => handleImageError(activeIndex)}
          />
        ) : (
          renderPlaceholder()
        )}
      </button>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-space-2 overflow-x-auto pb-1 snap-x">
          {images.map((image, index) => {
            const isThumbError = imageError[index];
            const isActive = index === activeIndex;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative w-20 h-20 shrink-0 rounded-radius-sm overflow-hidden bg-navy-base/5 border transition-all snap-start ${
                  isActive
                    ? "border-red-signal ring-1 ring-red-signal opacity-100"
                    : "border-border-hairline opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${index + 1}`}
                aria-pressed={isActive}
              >
                {!isThumbError ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-slate/40">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Overlay */}
      {isLightboxOpen && activeImage && !hasError && (
        <div 
          className="fixed inset-0 z-[100] bg-navy-deep/90 flex items-center justify-center p-space-4 sm:p-space-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-0 right-0 z-10 text-ivory/70 hover:text-ivory bg-navy-deep/50 hover:bg-navy-deep/80 p-2 rounded-radius-sm transition-colors"
              aria-label="Close lightbox"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.url}
              alt={activeImage.altText || productName}
              className="max-w-full max-h-full object-contain shadow-card-hover rounded-radius-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
