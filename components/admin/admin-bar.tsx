"use client";

import { LogOut, Pencil } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEditMode } from "./edit-mode";

export function AdminBar() {
  const router = useRouter();
  const { isAdmin, enabled, toggle } = useEditMode();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <div className="fixed bottom-space-4 right-space-4 z-50 flex flex-wrap items-center justify-between gap-space-2 bg-navy-deep text-ivory px-space-4 py-space-2 rounded-radius-sm shadow-md border border-navy-base max-w-[calc(100vw-2rem)]">
      <span className="font-body text-body-sm font-medium mr-space-2">
        Mode Admin Aktif
      </span>

      {isAdmin && (
        <button
          onClick={toggle}
          aria-pressed={enabled}
          title={
            enabled
              ? "Sembunyikan tombol edit dan lihat halaman seperti pengunjung"
              : "Tampilkan tombol edit pada setiap bagian yang bisa diubah"
          }
          className={`flex items-center gap-space-2 text-body-sm rounded-radius-sm px-space-2 transition-colors min-h-[44px] mr-space-2 ${
            enabled
              ? "bg-red-signal text-ivory hover:bg-red-signal/90"
              : "text-ivory/80 hover:text-ivory hover:bg-ivory/10"
          }`}
        >
          <Pencil className="w-4 h-4 shrink-0" />
          <span className="font-medium whitespace-nowrap">
            {enabled ? "Selesai Edit" : "Edit Konten"}
          </span>
        </button>
      )}

      <button
        onClick={handleLogout}
        className="flex items-center gap-space-2 text-body-sm text-ivory/80 hover:text-red-signal transition-colors min-h-[44px] min-w-[44px] p-2 -mr-2"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Keluar</span>
      </button>
    </div>
  );
}
