"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    
    // Relative redirect to login on the current secret slug
    const currentPath = window.location.pathname;
    const loginPath = currentPath.endsWith('/') ? `${currentPath}login` : `${currentPath}/login`;
    
    router.push(loginPath);
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-signal hover:bg-red-signal/90 text-ivory px-space-3 py-space-1 rounded-radius-sm font-body font-medium text-body-sm transition-colors"
    >
      Logout
    </button>
  );
}
