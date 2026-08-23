"use client";

import { useState, useTransition } from "react";
import { InlineEditModal } from "@/components/admin/inline-edit-modal";
import { 
  createCertification, 
  updateCertification, 
  uploadCertificationFile 
} from "@/app/(public)/sertifikasi/actions";

type CertificationData = {
  id?: string;
  name: string;
  issuingBody: string;
  validUntil: string | null;
  description: string | null;
  logoUrl: string | null;
  certificateUrl: string | null;
  isActive: boolean;
};

type CertificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CertificationData | null;
};

export function CertificationModal({ isOpen, onClose, initialData }: CertificationModalProps) {
  const [formData, setFormData] = useState<CertificationData>(
    initialData || {
      name: "",
      issuingBody: "",
      validUntil: null,
      description: "",
      logoUrl: null,
      certificateUrl: null,
      isActive: true,
    }
  );

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.issuingBody) {
      setError("Nama dan Penerbit wajib diisi.");
      return;
    }

    setUploading(true);
    try {
      let uploadedLogoUrl = formData.logoUrl;
      if (logoFile) {
        const logoData = new FormData();
        logoData.append("file", logoFile);
        const { url } = await uploadCertificationFile(logoData);
        uploadedLogoUrl = url;
      }

      let uploadedPdfUrl = formData.certificateUrl;
      if (pdfFile) {
        const pdfData = new FormData();
        pdfData.append("file", pdfFile);
        const { url } = await uploadCertificationFile(pdfData);
        uploadedPdfUrl = url;
      }

      const payload = {
        ...formData,
        description: formData.description || "",
        logoUrl: uploadedLogoUrl,
        certificateUrl: uploadedPdfUrl,
        validUntil: formData.validUntil || null,
      };

      startTransition(async () => {
        try {
          if (formData.id) {
            await updateCertification(formData.id, payload);
          } else {
            await createCertification(payload);
          }
          onClose();
        } catch (err) {
          setError("Gagal menyimpan ke database.");
          console.error(err);
        } finally {
          setUploading(false);
        }
      });
    } catch (err) {
      setError("Gagal mengunggah file.");
      console.error(err);
      setUploading(false);
    }
  };

  const isBusy = isPending || uploading;

  return (
    <InlineEditModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData?.id ? "Edit Sertifikasi" : "Tambah Sertifikasi"}
    >
      <form onSubmit={handleSave} className="space-y-space-4">
        {error && <div className="text-red-signal text-body-sm font-medium">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          <div>
            <label className="block text-body-sm font-medium text-navy-deep mb-2">Nama Sertifikasi *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isBusy}
              className="w-full bg-ivory/50 border border-slate/30 rounded-radius-sm p-space-2 text-body-md focus:border-navy-deep outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-body-sm font-medium text-navy-deep mb-2">Penerbit *</label>
            <input
              type="text"
              value={formData.issuingBody}
              onChange={(e) => setFormData({ ...formData, issuingBody: e.target.value })}
              disabled={isBusy}
              className="w-full bg-ivory/50 border border-slate/30 rounded-radius-sm p-space-2 text-body-md focus:border-navy-deep outline-none transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-body-sm font-medium text-navy-deep mb-2">Masa Berlaku (Opsional)</label>
          <input
            type="date"
            value={formData.validUntil ? formData.validUntil.split("T")[0] : ""}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            disabled={isBusy}
            className="w-full bg-ivory/50 border border-slate/30 rounded-radius-sm p-space-2 text-body-md focus:border-navy-deep outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-body-sm font-medium text-navy-deep mb-2">Deskripsi (Opsional)</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={isBusy}
            rows={3}
            className="w-full bg-ivory/50 border border-slate/30 rounded-radius-sm p-space-2 text-body-md focus:border-navy-deep outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          <div>
            <label className="block text-body-sm font-medium text-navy-deep mb-2">Logo Sertifikasi (Gambar)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              disabled={isBusy}
              className="w-full text-body-sm"
            />
            {formData.logoUrl && !logoFile && (
              <p className="text-[11px] text-slate mt-1">Logo saat ini sudah tersimpan.</p>
            )}
          </div>
          <div>
            <label className="block text-body-sm font-medium text-navy-deep mb-2">Dokumen (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              disabled={isBusy}
              className="w-full text-body-sm"
            />
            {formData.certificateUrl && !pdfFile && (
              <p className="text-[11px] text-slate mt-1">PDF saat ini sudah tersimpan.</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            disabled={isBusy}
            className="w-4 h-4 rounded text-navy-deep focus:ring-navy-deep"
          />
          <label htmlFor="isActive" className="text-body-sm text-navy-deep font-medium">
            Tampilkan di Publik
          </label>
        </div>

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
            type="submit" 
            disabled={isBusy}
            className="px-4 py-2 bg-navy-deep text-ivory rounded-radius-sm hover:bg-navy-base transition-colors flex items-center gap-2"
          >
            {isBusy ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </InlineEditModal>
  );
}
