"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth-helpers";

async function requireAdmin() {
  if (!(await isAdminRequest())) {
    throw new Error("Unauthorized: Admin access required.");
  }
}

export async function setMessageRead(id: string, isRead: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function markAllMessagesRead() {
  await requireAdmin();
  await prisma.contactMessage.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
