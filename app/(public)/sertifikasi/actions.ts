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

export async function uploadCertificationFile(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const { uploadFile } = await import("@/lib/storage");
  // Distinguish folder dynamically if needed, but "certifications" is fine.
  const url = await uploadFile(file, "certifications");
  return { url };
}

const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama sertifikasi wajib diisi"),
  issuingBody: z.string().min(1, "Penerbit wajib diisi"),
  validUntil: z.string().optional().nullable(),
  description: z.string().optional().nullable().transform(v => v || ""),
  logoUrl: z.string().optional().nullable(),
  certificateUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function createCertification(data: z.infer<typeof certificationSchema>) {
  await requireAdmin();
  const parsed = certificationSchema.parse(data);

  await prisma.certification.create({
    data: {
      name: parsed.name,
      issuingBody: parsed.issuingBody,
      validUntil: parsed.validUntil ? new Date(parsed.validUntil) : null,
      description: parsed.description,
      logoUrl: parsed.logoUrl,
      certificateUrl: parsed.certificateUrl,
      isActive: parsed.isActive,
    },
  });

  revalidatePath("/sertifikasi");
}

export async function updateCertification(id: string, data: z.infer<typeof certificationSchema>) {
  await requireAdmin();
  const parsed = certificationSchema.parse(data);

  await prisma.certification.update({
    where: { id },
    data: {
      name: parsed.name,
      issuingBody: parsed.issuingBody,
      validUntil: parsed.validUntil ? new Date(parsed.validUntil) : null,
      description: parsed.description,
      logoUrl: parsed.logoUrl,
      certificateUrl: parsed.certificateUrl,
      isActive: parsed.isActive,
    },
  });

  revalidatePath("/sertifikasi");
}

export async function deleteCertification(id: string) {
  await requireAdmin();
  await prisma.certification.delete({ where: { id } });
  revalidatePath("/sertifikasi");
}

export async function toggleCertificationActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.certification.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath("/sertifikasi");
}
