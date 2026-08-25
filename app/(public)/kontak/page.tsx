import type { Metadata } from "next";
import { ContactInfo } from "@/components/kontak/contact-info";
import { ContactForm } from "@/components/kontak/contact-form";
import { Editable } from "@/components/admin/editable";
import { SeoEditButton } from "@/components/admin/seo-edit-button";
import { AdminActionNotice } from "@/components/shared/admin-action-notice";
import { getBlock, getBlocks } from "@/lib/content/get-blocks";
import { getBlockFormSpec } from "@/lib/content/blocks";
import { buildMetadata } from "@/lib/content/metadata";
import { isAdminRequest } from "@/lib/auth-helpers";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getBlock("seo.kontak"));
}

export default async function KontakPage() {
  const [content, isAdmin] = await Promise.all([
    getBlocks(["kontak.header", "site.contact", "seo.kontak"]),
    isAdminRequest(),
  ]);
  const contact = content["site.contact"];

  return (
    <main className="min-h-screen bg-ivory text-navy-deep flex flex-col">
      {/* 1. Page Header Band */}
      <Editable
        spec={getBlockFormSpec("kontak.header")}
        data={content["kontak.header"]}
        label="Edit Header"
      >
        <section className="bg-navy-deep text-ivory py-space-8 px-space-4 md:px-space-6 border-b border-slate/20">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <span className="font-mono text-caption text-gold-hairline uppercase tracking-wider mb-space-3">
              {content["kontak.header"].eyebrow}
            </span>
            <h1 className="font-display font-medium text-display-lg text-ivory max-w-4xl leading-tight">
              {content["kontak.header"].title}
            </h1>
            <p className="font-body text-body-lg text-ivory/80 max-w-2xl mt-space-3">
              {content["kontak.header"].subtitle}
            </p>
          </div>
        </section>
      </Editable>

      {/* 2. Main Section — Two-Column Layout */}
      <section className="bg-ivory py-space-12 px-space-4 md:px-space-6 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/*
            Grid layout:
            Mobile/Tablet (<1024px) -> 1 column
            Desktop (>=1024px) -> 2 columns with ratio ~ 1fr : 1.3fr
            Order on mobile: Info column comes first naturally in DOM.
          */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-space-8">

            {/* Left Column: Contact Info & Maps */}
            <div className="flex flex-col gap-space-6">
              <Editable
                spec={getBlockFormSpec("site.contact")}
                data={contact}
                label="Edit Kontak"
              >
                <ContactInfo contact={contact} isAdmin={isAdmin} />
              </Editable>

              {/* Google Maps Embed */}
              <div className="bg-white rounded-radius-md shadow-card overflow-hidden">
                <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] w-full">
                  <iframe
                    title={`Lokasi ${contact.companyName}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`}
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div>
              {isAdmin ? <AdminActionNotice action="Pengiriman pesan kontak" /> : <ContactForm />}
            </div>

          </div>
        </div>
      </section>

      <SeoEditButton spec={getBlockFormSpec("seo.kontak")} data={content["seo.kontak"]} />
    </main>
  );
}
