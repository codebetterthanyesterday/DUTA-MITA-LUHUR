"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
}

// History
const historySchema = z.object({
  historyIntro: z.string().min(1),
  historyBody: z.string().min(1),
});
export async function updateCompanyHistory(data: { historyIntro: string; historyBody: string }) {
  await requireAdmin();
  const parsed = historySchema.parse(data);

  await prisma.companyProfile.upsert({
    where: { id: "main" },
    create: { id: "main", ...parsed, vision: "" },
    update: parsed,
  });

  revalidatePath("/tentang-kami");
}

// Vision & Mission
const visionMissionSchema = z.object({
  vision: z.string().min(1),
  missionItems: z.array(z.string().min(1)),
});
export async function updateVisionMission(data: { vision: string; missionItems: string[] }) {
  await requireAdmin();
  const parsed = visionMissionSchema.parse(data);

  await prisma.$transaction(async (tx) => {
    await tx.companyProfile.upsert({
      where: { id: "main" },
      create: { id: "main", historyIntro: "", historyBody: "", vision: parsed.vision },
      update: { vision: parsed.vision },
    });
    
    await tx.companyMissionItem.deleteMany({
      where: { companyProfileId: "main" },
    });

    if (parsed.missionItems.length > 0) {
      await tx.companyMissionItem.createMany({
        data: parsed.missionItems.map((text, idx) => ({
          text,
          sortOrder: idx,
          companyProfileId: "main",
        })),
      });
    }
  });

  revalidatePath("/tentang-kami");
}

// Facility Stats
const facilityStatsSchema = z.object({
  stats: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1),
  })),
});
export async function updateFacilityStats(data: { stats: { label: string; value: string }[] }) {
  await requireAdmin();
  const parsed = facilityStatsSchema.parse(data);

  await prisma.$transaction(async (tx) => {
    // Ensure profile exists
    await tx.companyProfile.upsert({
      where: { id: "main" },
      create: { id: "main", historyIntro: "", historyBody: "", vision: "" },
      update: {}, // no-op update
    });
    
    await tx.facilityStat.deleteMany({
      where: { companyProfileId: "main" },
    });

    if (parsed.stats.length > 0) {
      await tx.facilityStat.createMany({
        data: parsed.stats.map((s, idx) => ({
          label: s.label,
          value: s.value,
          sortOrder: idx,
          companyProfileId: "main",
        })),
      });
    }
  });

  revalidatePath("/tentang-kami");
}

// Facility Gallery
const facilityGallerySchema = z.object({
  images: z.array(z.object({
    url: z.string().min(1),
    altText: z.string().min(1),
  })),
});
export async function updateFacilityGallery(data: { images: { url: string; altText: string }[] }) {
  await requireAdmin();
  const parsed = facilityGallerySchema.parse(data);

  await prisma.$transaction(async (tx) => {
    // Ensure profile exists
    await tx.companyProfile.upsert({
      where: { id: "main" },
      create: { id: "main", historyIntro: "", historyBody: "", vision: "" },
      update: {},
    });
    
    await tx.facilityImage.deleteMany({
      where: { companyProfileId: "main" },
    });

    if (parsed.images.length > 0) {
      await tx.facilityImage.createMany({
        data: parsed.images.map((img, idx) => ({
          url: img.url,
          altText: img.altText,
          sortOrder: idx,
          companyProfileId: "main",
        })),
      });
    }
  });

  revalidatePath("/tentang-kami");
}

export async function uploadFacilityImageAction(formData: FormData) {
  await requireAdmin();
  
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const { uploadFile } = await import("@/lib/storage");
  const url = await uploadFile(file, "facility-images");
  return { url };
}
