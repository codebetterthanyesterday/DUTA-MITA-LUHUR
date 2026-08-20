"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { RfqStatus } from "@prisma/client";

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["NEW", "IN_PROGRESS", "CLOSED"]),
});

export type ActionResponse = { success: true } | { success: false; error: string };

export async function updateRfqStatus(id: string, status: RfqStatus): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = updateStatusSchema.safeParse({ id, status });
    if (!parsed.success) {
      return { success: false, error: "Invalid status value provided." };
    }

    await prisma.rFQ.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    revalidatePath("/admin/rfq");
    return { success: true };
  } catch (err: any) {
    console.error("updateRfqStatus error:", err);
    return { success: false, error: err.message || "Failed to update RFQ status." };
  }
}
