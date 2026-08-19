"use client";

import { useState } from "react";
import { CompanyProfile } from "@/lib/content/company-profile";
import { Lightbox } from "@/components/ui/lightbox";

type FacilityGalleryProps = {
  images: CompanyProfile["facilityImages"];
};

export function FacilityGallery({ images }: FacilityGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activeAltText = lightboxIndex !== null ? images[lightboxIndex].altText : "";

  return (
    <section className="bg-ivory py-space-12 md:py-space-16 px-space-4 md:px-space-6 border-t border-border-hairline">
      <div className="max-w-7xl mx-auto">
        <div className="mb-space-8 text-center md:text-left">
          <h2 className="font-display font-medium text-display-lg text-navy-deep">
            Fasilitas Kami
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className="relative w-full aspect-[4/3] rounded-radius-md bg-navy-base/5 border border-border-hairline overflow-hidden group cursor-zoom-in hover:bg-navy-base/10 transition-colors flex flex-col items-center justify-center p-space-4 text-center"
              aria-label={`View larger image of ${img.altText}`}
            >
              <span className="font-mono text-caption text-slate/60 uppercase group-hover:text-navy-deep transition-colors">
                {img.altText}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        imageUrl="" // We don't have real images yet
        altText={activeAltText}
      />
    </section>
  );
}
