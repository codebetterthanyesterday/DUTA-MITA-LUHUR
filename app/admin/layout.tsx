import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <nav className="flex-grow p-space-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          <Link
            href="./"
            className="flex-shrink-0 px-space-3 py-space-2 rounded-radius-sm text-body-sm font-medium hover:bg-slate/10 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="products"
            className="flex-shrink-0 px-space-3 py-space-2 rounded-radius-sm text-body-sm font-medium hover:bg-slate/10 transition-colors"
          >
            Produk
          </Link>
          <div className="flex-shrink-0 px-space-3 py-space-2 rounded-radius-sm text-body-sm font-medium text-ivory/50 cursor-not-allowed">
            Kategori (Coming Soon)
          </div>
          <div className="flex-shrink-0 px-space-3 py-space-2 rounded-radius-sm text-body-sm font-medium text-ivory/50 cursor-not-allowed">
            RFQ (Coming Soon)
          </div>
        </nav>
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
