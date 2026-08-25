"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CertificationModal } from "./certification-modal";
import { useEditMode } from "@/components/admin/edit-mode";

export function AddCertificationButton() {
  const { enabled } = useEditMode();
  const [isOpen, setIsOpen] = useState(false);

  if (!enabled) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-red-signal text-white px-space-4 py-space-2 rounded-radius-sm font-medium hover:bg-red-signal/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Tambah Sertifikasi</span>
      </button>

      <CertificationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialData={null}
      />
    </>
  );
}
