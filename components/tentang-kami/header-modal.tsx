"use client";

import { useState } from "react";
import { updateHeader } from "@/app/(public)/tentang-kami/actions";
import { X } from "lucide-react";

interface HeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    title: string;
    subtitle: string;
  };
}

export function HeaderModal({ isOpen, onClose, initialData }: HeaderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const headerTitle = formData.get("headerTitle") as string;
    const headerSubtitle = formData.get("headerSubtitle") as string;

    if (!headerTitle || !headerSubtitle) {
      setError("Semua field harus diisi");
      setIsSubmitting(false);
      return;
    }

    try {
      await updateHeader({ headerTitle, headerSubtitle });
      onClose();
    } catch (error) {
      console.error("Failed to update header:", error);
      setError("Gagal memperbarui header.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/80 backdrop-blur-sm p-4">
      <div className="bg-ivory w-full max-w-2xl rounded-radius-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate/20">
          <h2 className="font-display text-heading-3 text-navy-deep">Edit Header Tentang Kami</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate hover:text-navy-deep transition-colors rounded-full hover:bg-slate/10"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 flex-1 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-radius-sm">
              {error}
            </div>
          )}
          <div className="space-y-6">
            <div>
              <label className="block text-body-sm font-bold text-navy-deep mb-2">
                Judul Utama
              </label>
              <input
                name="headerTitle"
                defaultValue={initialData.title}
                className="w-full px-4 py-3 bg-white border border-slate/30 rounded-radius-sm text-navy-deep focus:outline-none focus:border-navy-deep transition-colors"
                placeholder="Contoh: Kami mengolah karet alam sejak awal 2000-an"
              />
            </div>

            <div>
              <label className="block text-body-sm font-bold text-navy-deep mb-2">
                Subjudul
              </label>
              <textarea
                name="headerSubtitle"
                defaultValue={initialData.subtitle}
                className="w-full px-4 py-3 bg-white border border-slate/30 rounded-radius-sm text-navy-deep focus:outline-none focus:border-navy-deep transition-colors min-h-[120px]"
                placeholder="Contoh: Dari kebun petani sampai kontainer di Tanjung Perak..."
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-mono text-button font-bold text-navy-deep hover:bg-slate/10 rounded-radius-sm transition-colors"
            >
              BATAL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 font-mono text-button font-bold text-ivory bg-gold-base hover:bg-gold-muted rounded-radius-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "MENYIMPAN..." : "SIMPAN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
