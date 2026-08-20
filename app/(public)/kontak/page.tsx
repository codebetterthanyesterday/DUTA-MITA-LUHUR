import type { Metadata } from "next";
import { ContactInfo } from "@/components/kontak/contact-info";
import { ContactForm } from "@/components/kontak/contact-form";

export const metadata: Metadata = {
  title: "Hubungi Kami — PT Duta Mita Luhur",
  description:
    "Hubungi PT Duta Mita Luhur untuk pertanyaan umum, informasi perusahaan, atau bantuan terkait ekspor karet alam. Kantor pusat kami berlokasi di Surabaya, Indonesia.",
};

export default function KontakPage() {
  return (
    <main className="min-h-screen bg-ivory text-navy-deep flex flex-col">
      {/* 1. Page Header Band */}
      <section className="bg-navy-deep text-ivory py-space-8 px-space-4 md:px-space-6 border-b border-slate/20">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="font-mono text-caption text-gold-hairline uppercase tracking-wider mb-space-3">
            HUBUNGI KAMI
          </span>
          <h1 className="font-display font-medium text-display-lg text-ivory max-w-4xl leading-tight">
            Mari Jalin Kerja Sama Jangka Panjang
          </h1>
          <p className="font-body text-body-lg text-ivory/80 max-w-2xl mt-space-3">
            Tim kami siap membantu menjawab pertanyaan Anda terkait operasional, kemitraan, dan layanan kami.
          </p>
        </div>
      </section>

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
              <ContactInfo />

              {/* Google Maps Embed */}
              <div className="bg-white rounded-radius-md shadow-card overflow-hidden">
                {/* 
                  TODO: replace query with real company coordinates/address once provided by client 
                  For now using a generic industrial area in Surabaya
                */}
                <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] w-full">
                  <iframe
                    title="Lokasi Duta Mita Luhur"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=Kawasan+Industri+Surabaya+Rungkut&output=embed"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
