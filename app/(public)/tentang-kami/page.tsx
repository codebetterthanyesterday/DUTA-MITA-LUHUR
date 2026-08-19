import type { Metadata } from "next";
import { companyProfile } from "@/lib/content/company-profile";

import { Header } from "@/components/tentang-kami/header";
import { History } from "@/components/tentang-kami/history";
import { VisionMission } from "@/components/tentang-kami/vision-mission";
import { FacilityGallery } from "@/components/tentang-kami/facility-gallery";
import { ExportReach } from "@/components/tentang-kami/export-reach";

import { StatsBand } from "@/components/shared/stats-band";
import { FinalCta } from "@/components/shared/final-cta";

export const metadata: Metadata = {
  title: "Tentang Kami — PT Duta Mitra Luhur",
  description:
    "Profil perusahaan, sejarah, kapasitas produksi, dan jangkauan ekspor PT Duta Mitra Luhur sebagai produsen karet alam terkemuka di Indonesia.",
};

export default function TentangKamiPage() {
  return (
    <main className="min-h-screen bg-ivory text-navy-deep flex flex-col">
      <Header />
      <History history={companyProfile.history} />
      <VisionMission vision={companyProfile.vision} mission={companyProfile.mission} />

      {/* 
        Stats Band explicitly requested to match PBI-04's exact styling.
        In PBI-04 (Home) it had bg-navy-base. We pass the same classes to the reusable component.
      */}
      <StatsBand stats={companyProfile.facilityStats} className="bg-navy-base text-ivory border-y border-slate/20" />

      <FacilityGallery images={companyProfile.facilityImages} />
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
