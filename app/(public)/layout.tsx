import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsappButton } from "@/components/shared/floating-whatsapp-button";
import { auth } from "@/auth";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = !!session?.user;

  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <FloatingWhatsappButton isAdmin={isAdmin} />
    </>
  );
}
