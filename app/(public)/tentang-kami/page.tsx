import type { Metadata } from "next";
import { getCompanyProfile } from "@/lib/content/company-profile";
import { SeoEditButton } from "@/components/admin/seo-edit-button";
import { getBlock } from "@/lib/content/get-blocks";
import { getBlockFormSpec } from "@/lib/content/blocks";
import { buildMetadata } from "@/lib/content/metadata";

import { Header } from "@/components/tentang-kami/header";
import { History } from "@/components/tentang-kami/history";
import { VisionMission } from "@/components/tentang-kami/vision-mission";
import { FacilityGallery } from "@/components/tentang-kami/facility-gallery";
import { ExportReach } from "@/components/tentang-kami/export-reach";
import { EditableStatsBand } from "@/components/tentang-kami/editable-stats-band";

import { FinalCta } from "@/components/shared/final-cta";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getBlock("seo.tentang-kami"));
}

export default async function TentangKamiPage() {
  const [companyProfile, seo] = await Promise.all([
    getCompanyProfile(),
    getBlock("seo.tentang-kami"),
  ]);
  if (!companyProfile) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-ivory text-navy-deep flex flex-col">
      <Header header={companyProfile.header} />
      <History history={companyProfile.history} />
      <VisionMission vision={companyProfile.vision} mission={companyProfile.mission} />

      {/* 
        Stats Band explicitly requested to match PBI-04's exact styling.
        In PBI-04 (Home) it had bg-navy-base. We pass the same classes to the reusable component.
      */}
      <EditableStatsBand stats={companyProfile.facilityStats} className="bg-navy-base text-ivory border-y border-slate/20" />

      <FacilityGallery images={companyProfile.facilityImages} />
      <ExportReach countries={companyProfile.exportCountries} />

      {/* 
        Final CTA explicitly requested to match PBI-04's layout but with 
        custom copy for this specific page.
      */}
      <FinalCta
        eyebrow="Tertarik bekerja sama?"
        title="Mari bicarakan kebutuhan karet Anda"
        description="Lihat dulu spesifikasi produk kami, atau langsung hubungi kami untuk membahas grade dan volume yang Anda cari."
        buttonText="Hubungi Kami"
        buttonHref="/kontak"
      />

      <SeoEditButton spec={getBlockFormSpec("seo.tentang-kami")} data={seo} />
    </main>
  );
}
