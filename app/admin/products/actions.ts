"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { uploadFile } from "@/lib/storage";
import { slugify } from "@/lib/slugify";

export async function uploadImageAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Sesi Anda sudah berakhir. Masuk lagi untuk melanjutkan.");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("Tidak ada berkas yang dipilih.");
  }

  const url = await uploadFile(file, "product-images");
  return { url };
}

const productSchema = z.object({
  name: z.string().min(1, "Nama produk diperlukan"),
  categoryId: z.string().min(1, "Kategori diperlukan"),
  shortDescription: z.string().min(1, "Deskripsi singkat diperlukan"),
  description: z.string().min(1, "Deskripsi lengkap diperlukan"),
  moqValue: z.number().positive("MOQ harus angka positif"),
  moqUnit: z.string().min(1, "Unit MOQ diperlukan"),
  packaging: z.string().min(1, "Packaging diperlukan"),
  isActive: z.boolean(),
  specifications: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1),
    })
  ),
  images: z.array(
    z.object({
      url: z.string().url(),
      isPrimary: z.boolean(),
    })
  ),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export async function createProduct(data: ProductFormValues) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Sesi Anda sudah berakhir. Masuk lagi untuk melanjutkan.");
  }

  const parsed = productSchema.parse(data);

  // Generate unique slug by appending a short random string if it collides? 
  // PBI-14 says: "auto-derive a slug server-side on save (same slugify approach as PBI-07)".
  // PBI-07 seed just uses standard slugify.
  const baseSlug = slugify(parsed.name);
  
  // To avoid collision, we can just append a random string if it exists
  let slug = baseSlug;
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.create({
      data: {
        name: parsed.name,
        slug,
        categoryId: parsed.categoryId,
        shortDescription: parsed.shortDescription,
        description: parsed.description,
        moqValue: parsed.moqValue,
        moqUnit: parsed.moqUnit,
        packaging: parsed.packaging,
        isActive: parsed.isActive,
        specifications: {
          create: parsed.specifications.map((spec, idx) => ({
            label: spec.label,
            value: spec.value,
            sortOrder: idx,
          })),
        },
        images: {
          create: parsed.images.map((img, idx) => ({
            url: img.url,
            altText: parsed.name,
            isPrimary: img.isPrimary,
            sortOrder: idx,
          })),
        },
      },
    });
  });

  revalidatePath("/admin/products");
  revalidatePath("/katalog");
  revalidatePath("/");
  
  return { success: true };
}

export async function updateProduct(id: string, data: ProductFormValues) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Sesi Anda sudah berakhir. Masuk lagi untuk melanjutkan.");
  }

  const parsed = productSchema.parse(data);

  const existingProduct = await prisma.product.findUnique({
    where: { id },
    select: { name: true, slug: true },
  });

  if (!existingProduct) {
    throw new Error("Produk itu sudah tidak ada.");
  }

  let slug = existingProduct.slug;
  if (existingProduct.name !== parsed.name) {
    const baseSlug = slugify(parsed.name);
    const existingSlug = await prisma.product.findUnique({ where: { slug: baseSlug } });
    if (existingSlug && existingSlug.id !== id) {
      slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    } else {
      slug = baseSlug;
    }
  }

  await prisma.$transaction(async (tx) => {
    // Delete existing relations
    await tx.productSpecification.deleteMany({ where: { productId: id } });
    await tx.productImage.deleteMany({ where: { productId: id } });

    // Update product and create new relations
    await tx.product.update({
      where: { id },
      data: {
        name: parsed.name,
        slug,
        categoryId: parsed.categoryId,
        shortDescription: parsed.shortDescription,
        description: parsed.description,
        moqValue: parsed.moqValue,
        moqUnit: parsed.moqUnit,
        packaging: parsed.packaging,
        isActive: parsed.isActive,
        specifications: {
          create: parsed.specifications.map((spec, idx) => ({
            label: spec.label,
            value: spec.value,
            sortOrder: idx,
          })),
        },
        images: {
          create: parsed.images.map((img, idx) => ({
            url: img.url,
            altText: parsed.name,
            isPrimary: img.isPrimary,
            sortOrder: idx,
          })),
        },
      },
    });
  });

  revalidatePath("/admin/products");
  revalidatePath("/katalog");
  revalidatePath("/");
  if (existingProduct.slug) {
    revalidatePath(`/katalog/${existingProduct.slug}`);
  }
  if (slug !== existingProduct.slug) {
    revalidatePath(`/katalog/${slug}`);
  }

  return { success: true };
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Sesi Anda sudah berakhir. Masuk lagi untuk melanjutkan.");
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: { slug: true }
  });

  if (!product) {
    throw new Error("Produk itu sudah tidak ada.");
  }

  // Delete product. ProductSpecification and ProductImage will be cascade deleted
  // _RfqProducts implicit M:N will also be cleaned up automatically without deleting the RFQ.
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/katalog");
  revalidatePath("/");
  revalidatePath(`/katalog/${product.slug}`);

  return { success: true };
}

export async function toggleProductStatus(id: string, newStatus: boolean) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Sesi Anda sudah berakhir. Masuk lagi untuk melanjutkan.");
  }

  const product = await prisma.product.update({
    where: { id },
    data: { isActive: newStatus },
    select: { slug: true }
  });

  revalidatePath("/admin/products");
  revalidatePath("/katalog");
  revalidatePath("/");
  revalidatePath(`/katalog/${product.slug}`);

  return { success: true };
}

export async function bulkDeleteProducts(ids: string[]) {
  const session = await auth();
  if (!session?.user) throw new Error("Sesi Anda sudah berakhir. Masuk lagi untuk melanjutkan.");
  if (!ids?.length) return { success: true };

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { slug: true }
  });

  await prisma.product.deleteMany({
    where: { id: { in: ids } },
  });

  revalidatePath("/admin/products");
  revalidatePath("/katalog");
  revalidatePath("/");
  for (const p of products) {
    if (p.slug) revalidatePath(`/katalog/${p.slug}`);
  }

  return { success: true };
}

export async function bulkUpdateProducts(ids: string[], data: { isActive?: boolean; categoryId?: string }) {
  const session = await auth();
  if (!session?.user) throw new Error("Sesi Anda sudah berakhir. Masuk lagi untuk melanjutkan.");
  if (!ids?.length) return { success: true };

  const updateData: any = {};
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

  if (Object.keys(updateData).length === 0) return { success: true };

  await prisma.product.updateMany({
    where: { id: { in: ids } },
    data: updateData,
  });

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { slug: true }
  });

  revalidatePath("/admin/products");
  revalidatePath("/katalog");
  revalidatePath("/");
  for (const p of products) {
    if (p.slug) revalidatePath(`/katalog/${p.slug}`);
  }

  return { success: true };
}
