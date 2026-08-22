"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { slugify } from "@/lib/slugify";

const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  description: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export type ActionState = { success: true } | { success: false; error: string; fieldErrors?: any };

export async function createCategory(data: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const parsed = categorySchema.safeParse({
    name: data.get("name"),
    description: data.get("description"),
    sortOrder: data.get("sortOrder") ? parseInt(data.get("sortOrder") as string, 10) : undefined,
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid data", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, description, sortOrder } = parsed.data;

  let finalSortOrder = sortOrder;
  if (finalSortOrder === undefined) {
    const maxSort = await prisma.category.aggregate({ _max: { sortOrder: true } });
    finalSortOrder = (maxSort._max.sortOrder || 0) + 1;
  }

  let baseSlug = slugify(name);
  let slug = baseSlug;
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  }

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        sortOrder: finalSortOrder,
      }
    });

    revalidatePath("/admin/categories");
    revalidatePath("/katalog");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to create category:", err);
    return { success: false, error: "Gagal membuat kategori" };
  }
}

export async function updateCategory(id: string, data: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const parsed = categorySchema.safeParse({
    name: data.get("name"),
    description: data.get("description"),
    sortOrder: data.get("sortOrder") ? parseInt(data.get("sortOrder") as string, 10) : undefined,
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid data", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory) return { success: false, error: "Kategori tidak ditemukan" };

  const { name, description, sortOrder } = parsed.data;

  let finalSortOrder = sortOrder;
  if (finalSortOrder === undefined) {
    finalSortOrder = existingCategory.sortOrder;
  }

  let slug = existingCategory.slug;
  if (name !== existingCategory.name) {
    const baseSlug = slugify(name);
    const existingSlug = await prisma.category.findUnique({ where: { slug: baseSlug } });
    if (existingSlug && existingSlug.id !== id) {
      slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    } else {
      slug = baseSlug;
    }
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        sortOrder: finalSortOrder,
      }
    });

    revalidatePath("/admin/categories");
    revalidatePath("/katalog");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update category:", err);
    return { success: false, error: "Gagal memperbarui kategori" };
  }
}

export async function deleteCategory(id: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    });

    if (!category) return { success: false, error: "Kategori tidak ditemukan" };

    if (category._count.products > 0) {
      return { success: false, error: "Kategori masih memiliki produk terkait." };
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/categories");
    revalidatePath("/katalog");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete category:", err);
    return { success: false, error: "Gagal menghapus kategori" };
  }
}

export async function reassignAndDeleteCategory(id: string, targetCategoryId: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  if (id === targetCategoryId) {
    return { success: false, error: "Kategori tujuan tidak boleh sama dengan kategori yang dihapus" };
  }

  try {
    const [source, target] = await Promise.all([
      prisma.category.findUnique({ where: { id } }),
      prisma.category.findUnique({ where: { id: targetCategoryId } })
    ]);

    if (!source || !target) {
      return { success: false, error: "Kategori sumber atau tujuan tidak valid" };
    }

    // Individual product detail pages' breadcrumb will reflect this reassignment
    // within that page's existing revalidate = 3600 ISR window.
    await prisma.$transaction([
      prisma.product.updateMany({
        where: { categoryId: id },
        data: { categoryId: targetCategoryId }
      }),
      prisma.category.delete({
        where: { id }
      })
    ]);

    revalidatePath("/admin/categories");
    revalidatePath("/katalog");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to reassign and delete category:", err);
    return { success: false, error: "Gagal memindahkan produk dan menghapus kategori" };
  }
}
