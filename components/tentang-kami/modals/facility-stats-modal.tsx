"use client";

import { useState, useTransition } from "react";
import { InlineEditModal } from "@/components/admin/inline-edit-modal";
import { updateFacilityStats } from "@/app/(public)/tentang-kami/actions";
import { ProductSpecFields, SpecRow } from "@/components/admin/product-spec-fields";

type FacilityStatsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: { label: string; value: string }[];
};

export function FacilityStatsModal({ isOpen, onClose, initialData }: FacilityStatsModalProps) {
  const [stats, setStats] = useState<SpecRow[]>(
    initialData.map((s) => ({ id: crypto.randomUUID(), label: s.label, value: s.value }))
  );
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateFacilityStats({
          stats: stats.map((s) => ({ label: s.label, value: s.value })).filter(s => s.label && s.value),
        });
        onClose();
      } catch (err) {
        alert("Gagal menyimpan data.");
        console.error(err);
      }
    });
  };

  return (
    <InlineEditModal isOpen={isOpen} onClose={onClose} title="Edit Statistik Fasilitas">
      <div className="space-y-space-4">
        <ProductSpecFields
          items={stats}
          onChange={setStats}
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
