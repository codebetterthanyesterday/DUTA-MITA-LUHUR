"use client";

import { useState, useTransition } from "react";
import { InlineEditModal } from "@/components/admin/inline-edit-modal";
import { uploadFacilityImageAction, updateCompanyHistory } from "@/app/(public)/tentang-kami/actions";
import Image from "next/image";

type HistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: { intro: string; body: string; imageUrl?: string | null; imageAlt?: string | null };
};

export function HistoryModal({ isOpen, onClose, initialData }: HistoryModalProps) {
  const [intro, setIntro] = useState(initialData.intro);
  const [body, setBody] = useState(initialData.body);
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
  const [imageAlt, setImageAlt] = useState(initialData.imageAlt || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        let finalImageUrl = imageUrl;

        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          const { url } = await uploadFacilityImageAction(formData);
          finalImageUrl = url;
        }

        await updateCompanyHistory({ 
          historyIntro: intro, 
          historyBody: body,
          historyImageUrl: finalImageUrl || null,
          historyImageAlt: imageAlt || null,
        });
        
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        onClose();
      } catch (err) {
        alert("Gagal menyimpan data.");
        console.error(err);
      }
    });
  };

  return (
    <InlineEditModal isOpen={isOpen} onClose={onClose} title="Edit Riwayat Perusahaan">
      <div className="space-y-space-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <label className="block text-body-sm font-medium text-navy-deep mb-2">Intro Riwayat</label>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            disabled={isPending}
            rows={3}
            className="w-full bg-white border border-slate/30 rounded-radius-sm p-space-3 text-body-md focus:outline-none focus:border-navy-deep transition-colors"
          />
        </div>
        <div>
          <label className="block text-body-sm font-medium text-navy-deep mb-2">Isi Riwayat</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={isPending}
            rows={8}
            className="w-full bg-white border border-slate/30 rounded-radius-sm p-space-3 text-body-md focus:outline-none focus:border-navy-deep transition-colors"
          />
        </div>
        <div>
          <label className="block text-body-sm font-medium text-navy-deep mb-2">Gambar Riwayat (Opsional)</label>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              disabled={isPending}
              className="text-body-sm file:mr-4 file:py-2 file:px-4 file:rounded-radius-sm file:border-0 file:text-sm file:font-semibold file:bg-navy-deep file:text-white hover:file:bg-navy-base cursor-pointer"
            />
          </div>
          {(previewUrl || imageUrl) && (
            <div className="mt-4 relative aspect-[4/3] w-full max-w-sm rounded-radius-sm overflow-hidden border border-slate/20">
              <Image 
                src={previewUrl || imageUrl} 
                alt={imageAlt || "Preview Gambar"} 
                fill 
                className="object-cover"
                unoptimized={!!previewUrl} // Unoptimized for blob URLs
              />
            </div>
          )}
        </div>
        {(previewUrl || imageUrl) && (
          <div>
            <label className="block text-body-sm font-medium text-navy-deep mb-2">Teks Alternatif Gambar (SEO)</label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              disabled={isPending}
              placeholder="Deskripsikan gambar secara singkat..."
              className="w-full bg-white border border-slate/30 rounded-radius-sm p-space-3 text-body-md focus:outline-none focus:border-navy-deep transition-colors"
            />
          </div>
        )}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate/10">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isPending}
            className="px-4 py-2 text-slate hover:bg-slate/10 rounded-radius-sm transition-colors"
          >
            Batal
          </button>
          <button 
            type="button" 
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-2 bg-navy-deep text-ivory rounded-radius-sm hover:bg-navy-base transition-colors"
          >
            {isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </InlineEditModal>
  );
}
