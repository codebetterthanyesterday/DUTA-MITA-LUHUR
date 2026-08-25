"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";
import { isAdminRequest } from "@/lib/auth-helpers";

// Zod schema for validation
const contactSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  subject: z.string().optional(),
  message: z.string().min(10, { message: "Pesan minimal 10 karakter." }),
  companyWebsite: z.string().max(0, { message: "Honeypot filled" }), // Honeypot must be empty
});

export type ContactActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
};

export async function submitContactMessage(
  prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  if (await isAdminRequest()) {
    return {
      success: false,
      error: "Akun admin tidak dapat mengirim pesan kontak. Keluar dari akun admin untuk mengirimkan formulir ini sebagai pengunjung.",
    };
  }

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
    companyWebsite: formData.get("companyWebsite") as string,
  };

  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    const isHoneypotFilled = parsed.error.issues.some((i) => i.path[0] === "companyWebsite");
    if (isHoneypotFilled) {
      // Silently return fake success for bots
      return { success: true };
    }
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message } = parsed.data;

  try {
    // 1. Write to database (source of truth)
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    // 2. Best-effort send notification email
    await sendContactNotification({
      name,
      email,
      subject,
      message,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit contact message:", error);
    return {
      success: false,
      error: "Terjadi kesalahan sistem saat mengirim pesan. Silakan coba lagi nanti.",
    };
  }
}
