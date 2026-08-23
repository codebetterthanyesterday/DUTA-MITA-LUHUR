"use client";

import { useState, useTransition } from "react";
import { InlineEditModal } from "@/components/admin/inline-edit-modal";
import { updateCompanyHistory } from "@/app/(public)/tentang-kami/actions";

type HistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: { intro: string; body: string };
};

export function HistoryModal({ isOpen, onClose, initialData }: HistoryModalProps) {
  const [intro, setIntro] = useState(initialData.intro);
  const [body, setBody] = useState(initialData.body);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateCompanyHistory({ historyIntro: intro, historyBody: body });
        onClose();
      } catch (err) {
        alert("Gagal menyimpan data.");
        console.error(err);
      }
    });
  };

  return (
    <InlineEditModal isOpen={isOpen} onClose={onClose} title="Edit Riwayat Perusahaan">
      <div className="space-y-space-4">
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
