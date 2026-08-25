"use client";

import { useState, useTransition } from "react";
import { InlineEditModal } from "@/components/admin/inline-edit-modal";
import { updateVisionMission } from "@/app/(public)/tentang-kami/actions";
import { DynamicTextList, TextRow } from "@/components/admin/dynamic-text-list";
import { useToast } from "@/components/ui/toast";

type VisionMissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: { vision: string; mission: string[] };
};

export function VisionMissionModal({ isOpen, onClose, initialData }: VisionMissionModalProps) {
  const [vision, setVision] = useState(initialData.vision);
  const [missionItems, setMissionItems] = useState<TextRow[]>(
    initialData.mission.map((m) => ({ id: crypto.randomUUID(), value: m }))
  );
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateVisionMission({
          vision,
          missionItems: missionItems.map((m) => m.value).filter(Boolean),
        });
        onClose();
      } catch (err) {
        toast.error("Visi dan misi gagal disimpan. Coba lagi beberapa saat lagi.");
        console.error(err);
      }
    });
  };

  return (
    <InlineEditModal isOpen={isOpen} onClose={onClose} title="Edit Visi & Misi">
      <div className="space-y-space-4">
        <div>
          <label className="block text-body-sm font-medium text-navy-deep mb-2">Visi Perusahaan</label>
          <textarea
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            disabled={isPending}
            rows={3}
            className="w-full bg-white border border-slate/30 rounded-radius-sm p-space-3 text-body-md focus:outline-none focus:border-navy-deep transition-colors"
          />
        </div>
        
        <DynamicTextList
          items={missionItems}
          onChange={setMissionItems}
          label="Misi Perusahaan"
          placeholder="Tulis misi..."
          addButtonText="+ Tambah Misi"
          emptyMessage="Belum ada misi ditambahkan."
          disabled={isPending}
        />

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
