"use client";

import { useState, useTransition } from "react";
import { InlineEditModal } from "@/components/admin/inline-edit-modal";
import { updateFacilityGallery, uploadFacilityImageAction } from "@/app/(public)/tentang-kami/actions";
import { ImageManager, ImageState } from "@/components/admin/image-manager";
import { useToast } from "@/components/ui/toast";

type FacilityGalleryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: { url: string; altText: string }[];
};

export function FacilityGalleryModal({ isOpen, onClose, initialData }: FacilityGalleryModalProps) {
  const [imageState, setImageState] = useState<ImageState>({
    existing: initialData.map((img) => ({
      id: crypto.randomUUID(),
      url: img.url,
      isPrimary: false,
    })),
    newFiles: [],
  });
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const handleSave = async () => {
    setUploading(true);
    try {
      // 1. Upload new files
      const uploadedUrls: string[] = [];
      for (const fileObj of imageState.newFiles) {
        const formData = new FormData();
        formData.append("file", fileObj.file);
        const { url } = await uploadFacilityImageAction(formData);
        uploadedUrls.push(url);
      }

      // 2. Combine with existing
      const finalImages = [
        ...imageState.existing.map((img) => ({ url: img.url, altText: "Fasilitas DML" })),
        ...uploadedUrls.map((url) => ({ url, altText: "Fasilitas DML" })),
      ];

      // 3. Update DB
      startTransition(async () => {
        try {
          await updateFacilityGallery({ images: finalImages });
          onClose();
        } catch (err) {
          toast.error("Galeri gagal disimpan. Coba lagi beberapa saat lagi.");
          console.error(err);
        } finally {
          setUploading(false);
        }
      });
    } catch (err) {
      toast.error("Gambar gagal diunggah. Cek koneksi Anda, lalu coba lagi.");
      console.error(err);
      setUploading(false);
    }
  };

  const isBusy = isPending || uploading;

  return (
    <InlineEditModal isOpen={isOpen} onClose={onClose} title="Edit Galeri Fasilitas">
      <div className="space-y-space-4">
        <ImageManager
          state={imageState}
          onChange={setImageState}
          hidePrimary={true}
          disabled={isBusy}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate/10">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isBusy}
            className="px-4 py-2 text-slate hover:bg-slate/10 rounded-radius-sm transition-colors"
          >
            Batal
          </button>
          <button 
            type="button" 
            onClick={handleSave}
            disabled={isBusy}
            className="px-4 py-2 bg-navy-deep text-ivory rounded-radius-sm hover:bg-navy-base transition-colors flex items-center gap-2"
          >
            {isBusy ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </InlineEditModal>
  );
}
