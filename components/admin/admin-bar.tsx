"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AdminBar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <div className="fixed bottom-space-4 right-space-4 z-50 flex items-center bg-navy-deep text-ivory px-space-4 py-space-2 rounded-radius-sm shadow-md border border-navy-base">
      <span className="font-body text-body-sm font-medium mr-space-4">
        Mode Admin Aktif
      </span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-space-2 text-body-sm text-ivory/80 hover:text-red-signal transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="font-medium">Keluar</span>
      </button>
    </div>
  );
}
