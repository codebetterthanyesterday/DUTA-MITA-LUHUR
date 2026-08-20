"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { uploadProductImage } from "@/lib/storage";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uploadImageAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const url = await uploadProductImage(file);
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
    throw new Error("Unauthorized");
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
    throw new Error("Unauthorized");
  }

  const parsed = productSchema.parse(data);

  const existingProduct = await prisma.product.findUnique({
    where: { id },
    select: { name: true, slug: true },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
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
    throw new Error("Unauthorized");
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: { slug: true }
  });

  if (!product) {
    throw new Error("Product not found");
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
    throw new Error("Unauthorized");
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
