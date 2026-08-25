import { ShieldAlert } from "lucide-react";

/**
 * Stand-in for a customer-facing form (RFQ, contact) when the viewer is
 * signed in as an admin. Admin accounts manage the site, not the customer
 * pipeline, so submitting a lead to yourself makes no sense and would pollute
 * the RFQ/contact inbox — this replaces the form entirely rather than merely
 * disabling it, since a disabled form otherwise looks like a bug.
 */
export function AdminActionNotice({
  action,
  className = "",
}: {
  action: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-radius-md shadow-card p-space-6 md:p-space-8 flex flex-col items-center justify-center text-center h-full min-h-[400px] ${className}`}
    >
      <div className="w-16 h-16 bg-navy-base/5 text-slate rounded-full flex items-center justify-center mb-space-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h3 className="font-display font-medium text-display-md text-navy-deep mb-space-2">
        Tidak Tersedia untuk Akun Admin
      </h3>
      <p className="font-body text-slate text-body-md max-w-sm">
        {action} dinonaktifkan saat masuk sebagai admin. Keluar dari akun admin untuk mengirimkannya sebagai pengunjung.
      </p>
    </div>
  );
}
