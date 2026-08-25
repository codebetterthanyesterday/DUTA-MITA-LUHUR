import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsappButton } from "@/components/shared/floating-whatsapp-button";
import { AdminBar } from "@/components/admin/admin-bar";
import { Editable } from "@/components/admin/editable";
import { getBlocks } from "@/lib/content/get-blocks";
import { getBlockFormSpec } from "@/lib/content/blocks";
import { isAdminRequest } from "@/lib/auth-helpers";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, content] = await Promise.all([
    isAdminRequest(),
    getBlocks(["site.contact", "site.footerCredentials"]),
  ]);
  const contact = content["site.contact"];

  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>

      {/*
        The footer carries two independent blocks, so it is wrapped twice — the
        outer edit button sits left, the inner one right, and neither collides.
      */}
      <Editable
        spec={getBlockFormSpec("site.footerCredentials")}
        data={content["site.footerCredentials"]}
        label="Edit Sertifikasi"
        align="left"
      >
        <Editable
          spec={getBlockFormSpec("site.contact")}
          data={contact}
          label="Edit Info Perusahaan"
        >
          <Footer
            contact={contact}
            credentials={content["site.footerCredentials"]}
            isAdmin={isAdmin}
          />
        </Editable>
      </Editable>

      <FloatingWhatsappButton isAdmin={isAdmin} contact={contact} />
      {isAdmin && <AdminBar />}
    </>
  );
}
