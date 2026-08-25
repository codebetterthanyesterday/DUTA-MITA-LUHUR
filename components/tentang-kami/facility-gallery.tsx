"use client";

import { useState } from "react";
import Image from "next/image";
import { CompanyProfile } from "@/lib/content/company-profile";
import { Lightbox } from "@/components/ui/lightbox";
import { SectionEditButton } from "@/components/admin/section-edit-button";
import { FacilityGalleryModal } from "@/components/tentang-kami/modals/facility-gallery-modal";
import { useEditMode } from "@/components/admin/edit-mode";

type FacilityGalleryProps = {
  images: CompanyProfile["facilityImages"];
};

export function FacilityGallery({ images }: FacilityGalleryProps) {
  const { enabled: isAdmin } = useEditMode();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeAltText = lightboxIndex !== null ? images[lightboxIndex].altText : "";
  const activeImageUrl = lightboxIndex !== null ? images[lightboxIndex].url : "";

  return (
    <section className="relative group bg-ivory py-space-12 md:py-space-16 px-space-4 md:px-space-6 border-t border-border-hairline">
      {isAdmin && (
        <SectionEditButton onClick={() => setIsModalOpen(true)} label="Edit Galeri" className="" />
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-space-8 text-center md:text-left">
          <h2 className="font-display font-medium text-display-lg text-navy-deep">
            Fasilitas Kami
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-3">
          {images.map((img, idx) => (
            <FacilityImageButton key={idx} img={img} idx={idx} setLightboxIndex={setLightboxIndex} />
          ))}
        </div>
      </div>

      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        imageUrl={activeImageUrl}
        altText={activeAltText}
      />

      {isAdmin && (
        <FacilityGalleryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={images}
        />
      )}
    </section>
  );
}

function FacilityImageButton({ img, idx, setLightboxIndex }: { img: any; idx: number; setLightboxIndex: (idx: number) => void }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setLightboxIndex(idx)}
      className="relative w-full aspect-[4/3] rounded-radius-md bg-navy-base/5 border border-border-hairline overflow-hidden group/img cursor-zoom-in hover:bg-navy-base/10 transition-colors flex flex-col items-center justify-center p-space-4 text-center"
      aria-label={`View larger image of ${img.altText}`}
    >
      {img.url ? (
        <>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-space-2 text-center w-full h-full -z-10">
             <span className="font-mono text-caption text-slate/60 uppercase group-hover/img:text-navy-deep transition-colors">
               {img.altText}
             </span>
          </div>
          <Image
            src={img.url}
            alt={img.altText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover group-hover/img:scale-105 transition-all duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setIsLoaded(true)}
          />
          <div className="absolute inset-0 bg-navy-deep/0 group-hover/img:bg-navy-deep/20 transition-colors" />
          <span className="absolute bottom-4 left-4 right-4 text-center font-mono text-caption text-ivory opacity-0 group-hover/img:opacity-100 transition-opacity drop-shadow-md z-10">
            {img.altText}
          </span>
        </>
      ) : (
        <span className="font-mono text-caption text-slate/60 uppercase group-hover/img:text-navy-deep transition-colors">
          {img.altText}
        </span>
      )}
    </button>
  );
}
