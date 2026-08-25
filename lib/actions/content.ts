"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { BLOCKS, isBlockKey } from "@/lib/content/blocks";

export type UpdateBlockResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/**
 * Single write path for every inline-editable content block.
 *
 * The client sends a raw object; the block's own Zod schema decides whether it
 * is acceptable. Because the key is validated against the registry first, a
 * caller cannot write to an arbitrary row, and because the schema is looked up
 * server-side, a tampered client payload cannot widen the accepted shape.
 */
export async function updateBlock(
  key: string,
  data: unknown
): Promise<UpdateBlockResult> {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") {
    return { ok: false, message: "Tidak diizinkan. Silakan masuk sebagai admin." };
  }

  if (!isBlockKey(key)) {
    return { ok: false, message: `Bagian konten "${key}" tidak dikenal.` };
  }

  const def = BLOCKS[key];
  const parsed = def.schema.safeParse(data);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const fieldErrors: Record<string, string> = {};
    for (const [field, messages] of Object.entries(flat.fieldErrors)) {
      if (messages?.[0]) fieldErrors[field] = messages[0];
    }
    return {
      ok: false,
      message: flat.formErrors[0] ?? "Beberapa isian belum valid.",
      fieldErrors,
    };
  }

  await prisma.contentBlock.upsert({
    where: { key },
    create: { key, data: parsed.data },
    update: { data: parsed.data },
  });

  for (const target of def.revalidate) {
    revalidatePath(target.path, target.type);
  }

  return { ok: true };
}
