import { auth } from "@/auth";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <div className="p-space-6 md:p-space-10 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-4 border-b border-slate/20 pb-space-4 mb-space-6">
        <div>
          <h1 className="font-display font-medium text-display-lg text-ivory">
            Admin Dashboard
          </h1>
          <p className="font-body text-body-sm text-slate mt-space-1">
            Welcome, {session?.user?.email}
          </p>
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>

      <div className="bg-navy-deep p-space-6 rounded-radius-md border border-slate/10">
        <h2 className="font-display font-medium text-display-md text-ivory mb-space-2">
          Placeholder Area
        </h2>
        <p className="font-body text-body-md text-slate">
          This is a placeholder for the actual admin CRUD screens (PBI-14, 15, 16, 17, 18).
          Authentication and route protection are fully implemented.
        </p>
      </div>
    </div>
  );
}
