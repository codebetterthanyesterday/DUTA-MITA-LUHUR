export type CompanyProfile = {
  history: {
    intro: string;
    body: string;
  };
  vision: string;
  mission: string[];
  facilityStats: { label: string; value: string }[];
  facilityImages: { url: string; altText: string }[];
  exportCountries: string[];
};

export const staticExportCountries = [
  "Amerika Serikat",
  "Jepang",
  "Jerman",
  "Korea Selatan",
  "Tiongkok",
  "India",
  "Brasil",
  "Prancis",
  "Turki",
  "Italia",
];

import prisma from "@/lib/prisma";

export async function getCompanyProfile(): Promise<CompanyProfile | null> {
  const dbProfile = await prisma.companyProfile.findUnique({
    where: { id: "main" },
    include: {
      missionItems: { orderBy: { sortOrder: 'asc' } },
      facilityStats: { orderBy: { sortOrder: 'asc' } },
      facilityImages: { orderBy: { sortOrder: 'asc' } },
    }
  });

  if (!dbProfile) return null;

  return {
    history: {
      intro: dbProfile.historyIntro,
      body: dbProfile.historyBody,
    },
    vision: dbProfile.vision,
    mission: dbProfile.missionItems.map(m => m.text),
    facilityStats: dbProfile.facilityStats.map(s => ({
      label: s.label,
      value: s.value,
    })),
    facilityImages: dbProfile.facilityImages.map(i => ({
      url: i.url,
      altText: i.altText,
    })),
    exportCountries: staticExportCountries,
  };
}
