"use client";

import { useState } from "react";
import Image from "next/image";
import { CompanyProfile } from "@/lib/content/company-profile";
import { SectionEditButton } from "@/components/admin/section-edit-button";
import { HistoryModal } from "@/components/tentang-kami/modals/history-modal";
import { useEditMode } from "@/components/admin/edit-mode";

type HistoryProps = {
  history: CompanyProfile["history"];
};

export function History({ history }: HistoryProps) {
  const { enabled: isAdmin } = useEditMode();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative group bg-ivory py-space-12 md:py-space-16 px-space-4 md:px-space-6 border-b border-slate/10">
      {isAdmin && (
        <SectionEditButton onClick={() => setIsModalOpen(true)} label="Edit Riwayat" className="" />
      )}
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-space-6 md:gap-space-10 items-start">
        {/* Left Column: Prose */}
        <div className="prose prose-slate prose-lg max-w-none font-body text-navy-deep">
          <p className="text-body-lg font-medium leading-relaxed text-navy-deep">
            {history.intro}
          </p>
          {history.body.split("\n\n").map((paragraph, idx) => (
            <p key={idx} className="text-body-md leading-relaxed text-slate mt-space-4 whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Right Column: Image or Placeholder */}
        <div className="w-full aspect-[4/3] rounded-radius-md bg-navy-base/5 border border-border-hairline flex flex-col items-center justify-center p-space-4 text-center relative overflow-hidden">
          {history.imageUrl ? (
            <Image
              src={history.imageUrl}
              alt={history.imageAlt || "Fasilitas Pengolahan PT Duta Mitra Luhur"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <>
              <span className="font-mono text-caption text-slate/60 uppercase">
                Fasilitas Pengolahan
              </span>
              <span className="font-mono text-caption text-slate/40 mt-1">
                PT Duta Mitra Luhur
              </span>
            </>
          )}
        </div>
      </div>

      {isAdmin && (
        <HistoryModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          initialData={{ 
            intro: history.intro, 
            body: history.body,
            imageUrl: history.imageUrl,
            imageAlt: history.imageAlt
          }} 
        />
      )}
    </section>
  );
}
