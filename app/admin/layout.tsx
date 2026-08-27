import { auth } from "@/auth";
import { getAdminSlug } from "@/lib/admin-routes";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return <>{children}</>;
  }

  return (
    <AdminShell adminSlug={getAdminSlug()} userEmail={session.user.email ?? "Admin"}>
      {children}
    </AdminShell>
  );
}
