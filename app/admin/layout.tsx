import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";
import { AdminNav } from "@/components/admin/admin-nav";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return <>{children}</>;
  }
  return (
    <div className="min-h-screen bg-ivory text-navy-deep flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-navy-deep text-ivory flex flex-col min-h-[auto] md:min-h-screen shrink-0 border-b md:border-b-0 md:border-r border-slate/20">
        <div className="p-space-6 border-b border-slate/20 flex justify-between items-center md:block">
          <Link href="./" className="font-display font-medium text-display-sm hover:opacity-90 transition-opacity">
            DML Admin
          </Link>
          <div className="md:hidden">
            <LogoutButton />
          </div>
        </div>
        <AdminNav />
        <div className="p-space-4 border-t border-slate/20 hidden md:block">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow w-full md:w-[calc(100%-16rem)] h-full min-h-screen overflow-y-auto bg-ivory">
        {children}
      </main>
    </div>
  );
}
