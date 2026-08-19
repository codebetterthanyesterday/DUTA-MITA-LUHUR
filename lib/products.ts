import { cache } from "react";
import prisma from "@/lib/prisma";

export const getProductBySlug = cache(async (slug: string) => {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      specifications: { orderBy: { sortOrder: "asc" } },
    },
  });
});
