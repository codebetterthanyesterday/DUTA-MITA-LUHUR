import type { Metadata } from "next";
import { getCompanyProfile } from "@/lib/content/company-profile";

import { Header } from "@/components/tentang-kami/header";
import { History } from "@/components/tentang-kami/history";
import { VisionMission } from "@/components/tentang-kami/vision-mission";
import { FacilityGallery } from "@/components/tentang-kami/facility-gallery";
import { ExportReach } from "@/components/tentang-kami/export-reach";
import { EditableStatsBand } from "@/components/tentang-kami/editable-stats-band";

import { auth } from "@/auth";
import { FinalCta } from "@/components/shared/final-cta";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Tentang Kami — PT Duta Mitra Luhur",
  description:
    "Profil perusahaan, sejarah, kapasitas produksi, dan jangkauan ekspor PT Duta Mitra Luhur sebagai produsen karet alam terkemuka di Indonesia.",
};

export default async function TentangKamiPage() {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const companyProfile = await getCompanyProfile();
  if (!companyProfile) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-ivory text-navy-deep flex flex-col">
      <Header />
      <History history={companyProfile.history} isAdmin={isAdmin} />
      <VisionMission vision={companyProfile.vision} mission={companyProfile.mission} isAdmin={isAdmin} />

      {/* 
        Stats Band explicitly requested to match PBI-04's exact styling.
        In PBI-04 (Home) it had bg-navy-base. We pass the same classes to the reusable component.
      */}
      <EditableStatsBand stats={companyProfile.facilityStats} className="bg-navy-base text-ivory border-y border-slate/20" isAdmin={isAdmin} />

      <FacilityGallery images={companyProfile.facilityImages} isAdmin={isAdmin} />
      <ExportReach countries={companyProfile.exportCountries} />

      {/* 
        Final CTA explicitly requested to match PBI-04's layout but with 
        custom copy for this specific page.
      */}
      <FinalCta
        eyebrow="TERTARIK BEKERJA SAMA?"
        title="Jadilah Bagian dari Jaringan Mitra Global Kami"
        description="Jelajahi berbagai spesifikasi karet alam kami dan temukan bagaimana PT Duta Mitra Luhur dapat mendukung kontinuitas produksi industri Anda."
        buttonText="Hubungi Tim Ekspor"
        buttonHref="/kontak"
      />
    </main>
  );
}
