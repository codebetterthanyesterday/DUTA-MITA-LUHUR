export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy-base text-ivory">
      {children}
    </div>
  );
}
