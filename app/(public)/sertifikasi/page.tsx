import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { FinalCta } from "@/components/shared/final-cta";
import { auth } from "@/auth";
import { CertificationCard } from "@/components/sertifikasi/certification-card";
import { AddCertificationButton } from "@/components/sertifikasi/add-certification-button";
import { Editable } from "@/components/admin/editable";
import { SeoEditButton } from "@/components/admin/seo-edit-button";
import { getBlock, getBlocks } from "@/lib/content/get-blocks";
import { getBlockFormSpec } from "@/lib/content/blocks";
import { buildMetadata } from "@/lib/content/metadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getBlock("seo.sertifikasi"));
}

export default async function SertifikasiPage() {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const [certifications, content] = await Promise.all([
    prisma.certification.findMany({
      where: isAdmin ? undefined : { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    getBlocks([
      "sertifikasi.header",
      "sertifikasi.intro",
      "sertifikasi.disclaimer",
      "sertifikasi.finalCta",
      "seo.sertifikasi",
    ]),
  ]);

  return (
    <main className="min-h-screen bg-ivory text-navy-deep flex flex-col">
      {/* 1. Page Header Band */}
      <Editable
        spec={getBlockFormSpec("sertifikasi.header")}
        data={content["sertifikasi.header"]}
        label="Edit Header"
      >
        <section className="bg-navy-deep text-ivory py-space-8 px-space-4 md:px-space-6 border-b border-slate/20">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <span className="font-mono text-caption text-gold-hairline uppercase tracking-wider mb-space-3">
              {content["sertifikasi.header"].eyebrow}
            </span>
            <h1 className="font-display font-medium text-display-lg text-ivory max-w-4xl leading-tight">
              {content["sertifikasi.header"].title}
            </h1>
            <p className="font-body text-body-lg text-ivory/80 max-w-2xl mt-space-3">
              {content["sertifikasi.header"].subtitle}
            </p>
          </div>
        </section>
      </Editable>

      {/* 2. Trust Context Paragraph */}
      <Editable
        spec={getBlockFormSpec("sertifikasi.intro")}
        data={content["sertifikasi.intro"]}
        label="Edit Pengantar"
      >
        <section className="bg-ivory pt-space-12 pb-space-8 px-space-4 md:px-space-6">
          <div className="max-w-7xl mx-auto">
            <p className="font-body text-body-lg text-slate max-w-3xl leading-relaxed text-center md:text-left">
              {content["sertifikasi.intro"].body}
            </p>
          </div>
        </section>
      </Editable>

      {/* 3. Certification Grid */}
      <section className="bg-ivory pb-space-8 px-space-4 md:px-space-6">
        <div className="max-w-7xl mx-auto">
          {isAdmin && (
            <div className="flex justify-end mb-space-4">
              <AddCertificationButton />
            </div>
          )}

          {certifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-4">
              {certifications.map((cert) => (
                <CertificationCard key={cert.id} cert={cert} />
              ))}
            </div>
          ) : (
            <div className="w-full py-space-12 flex flex-col items-center justify-center text-center bg-navy-base/5 rounded-radius-md border border-border-hairline">
              <svg
                className="w-12 h-12 text-slate/40 mb-space-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h2 className="font-display font-medium text-display-md text-navy-deep mb-space-2">
                Sertifikasi Sedang Dipersiapkan
              </h2>
              <p className="text-body-md text-slate max-w-lg mb-space-6">
                Kami sedang dalam tahap pemutakhiran portofolio sertifikasi perusahaan. Silakan hubungi tim kami secara langsung untuk meminta dokumentasi kepatuhan terbaru.
              </p>
              <Link
                href="/kontak"
                className="inline-block border border-navy-deep/30 text-navy-deep hover:bg-navy-base/5 px-space-4 py-space-2 rounded-radius-sm font-body font-medium text-body-md transition-colors"
              >
                Hubungi Kami
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. Legal Disclaimer Note */}
      <Editable
        spec={getBlockFormSpec("sertifikasi.disclaimer")}
        data={content["sertifikasi.disclaimer"]}
        label="Edit Catatan"
      >
        <section className="bg-ivory pb-space-12 px-space-4 md:px-space-6">
          <div className="max-w-7xl mx-auto text-center md:text-left">
            <p className="text-caption text-slate">{content["sertifikasi.disclaimer"].body}</p>
          </div>
        </section>
      </Editable>

      {/* 5. Final CTA Band */}
      <Editable
        spec={getBlockFormSpec("sertifikasi.finalCta")}
        data={content["sertifikasi.finalCta"]}
        label="Edit Ajakan"
      >
        <FinalCta {...content["sertifikasi.finalCta"]} />
      </Editable>

      <SeoEditButton
        spec={getBlockFormSpec("seo.sertifikasi")}
        data={content["seo.sertifikasi"]}
      />
    </main>
  );
}
