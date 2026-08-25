"use client";

import { useState } from "react";
import { updateExportCountries } from "@/app/(public)/tentang-kami/actions";
import { X, Plus, Trash2 } from "lucide-react";

interface ExportReachModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: string[];
}

export function ExportReachModal({ isOpen, onClose, initialData }: ExportReachModalProps) {
  const [countries, setCountries] = useState<string[]>(initialData.length > 0 ? initialData : [""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Filter out empty countries
    const validCountries = countries.map(c => c.trim()).filter(c => c.length > 0);

    if (validCountries.length === 0) {
      setError("Minimal harus ada satu negara tujuan ekspor.");
      setIsSubmitting(false);
      return;
    }

    try {
      await updateExportCountries({ countries: validCountries });
      onClose();
    } catch (error) {
      console.error("Failed to update export countries:", error);
      setError("Gagal memperbarui jangkauan ekspor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCountry = () => {
    setCountries([...countries, ""]);
  };

  const removeCountry = (index: number) => {
    setCountries(countries.filter((_, i) => i !== index));
  };

  const updateCountry = (index: number, value: string) => {
    const newCountries = [...countries];
    newCountries[index] = value;
    setCountries(newCountries);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/80 backdrop-blur-sm p-4">
      <div className="bg-ivory w-full max-w-2xl rounded-radius-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate/20">
          <h2 className="font-display text-heading-3 text-navy-deep">Edit Jangkauan Ekspor</h2>
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
          <div className="space-y-4">
            <label className="block text-body-sm font-bold text-navy-deep">
              Daftar Negara Tujuan Ekspor
            </label>
            
            {countries.map((country, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  value={country}
                  onChange={(e) => updateCountry(index, e.target.value)}
                  className="flex-1 px-4 py-3 bg-white border border-slate/30 rounded-radius-sm text-navy-deep focus:outline-none focus:border-navy-deep transition-colors"
                  placeholder="Contoh: Amerika Serikat"
                />
                <button
                  type="button"
                  onClick={() => removeCountry(index)}
                  disabled={countries.length === 1}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-radius-sm transition-colors disabled:opacity-50"
                  title="Hapus Negara"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addCountry}
              className="mt-2 flex items-center gap-2 text-body-sm font-bold text-navy-deep hover:text-gold-base transition-colors"
            >
              <Plus size={16} /> Tambah Negara
            </button>
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
