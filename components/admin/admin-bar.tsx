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
    <div className="fixed bottom-space-4 right-space-4 z-50 flex flex-wrap items-center justify-between gap-space-2 bg-navy-deep text-ivory px-space-4 py-space-2 rounded-radius-sm shadow-md border border-navy-base max-w-[calc(100vw-2rem)]">
      <span className="font-body text-body-sm font-medium mr-space-4">
        Mode Admin Aktif
      </span>
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
