"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { countries } from "@/lib/countries";
import { isAdminRequest } from "@/lib/auth-helpers";

const rfqSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 huruf." }),
  company: z.string().min(2, { message: "Nama perusahaan minimal 2 huruf." }),
  country: z.enum(countries as [string, ...string[]], {
    message: "Pilih negara dari daftar."
  }),
  email: z.string().email({ message: "Sepertinya format emailnya keliru." }),
  phone: z.string().min(6, { message: "Nomor telepon minimal 6 angka." }),
  productIds: z.string().optional(),
  quantityEstimateValue: z.string().optional(),
  quantityEstimateUnit: z.string().optional(),
  message: z.string().optional(),
  companyWebsite: z.string().max(0, { message: "Honeypot filled" }), // Honeypot must be empty
}).refine(data => {
  if (data.quantityEstimateValue && !data.quantityEstimateUnit) {
    return false;
  }
  return true;
}, {
  message: "Pilih satuannya juga, kilogram atau kontainer.",
  path: ["quantityEstimateUnit"]
}).refine(data => {
  if (data.quantityEstimateValue) {
    const val = parseFloat(data.quantityEstimateValue);
    if (isNaN(val) || val <= 0) return false;
  }
  return true;
}, {
  message: "Jumlahnya harus berupa angka lebih dari 0.",
  path: ["quantityEstimateValue"]
});

export type RfqActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    name?: string[];
    company?: string[];
    country?: string[];
    email?: string[];
    phone?: string[];
    quantityEstimateValue?: string[];
    quantityEstimateUnit?: string[];
    message?: string[];
  };
};

export async function submitRfq(
  prevState: RfqActionState,
  formData: FormData
): Promise<RfqActionState> {
  if (await isAdminRequest()) {
    return {
      success: false,
      error: "Anda sedang masuk sebagai admin. Keluar dulu dari akun admin kalau mau mengirim permintaan sebagai pengunjung.",
    };
  }

  const data = {
    name: formData.get("name") as string,
    company: formData.get("company") as string,
    country: formData.get("country") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    productIds: formData.get("productIds") as string, // Comma separated
    quantityEstimateValue: formData.get("quantityEstimateValue") as string,
    quantityEstimateUnit: formData.get("quantityEstimateUnit") as string,
    message: formData.get("message") as string,
    companyWebsite: formData.get("companyWebsite") as string,
  };

  const parsed = rfqSchema.safeParse(data);

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

  const { 
    name, company, country, email, phone, 
    productIds, quantityEstimateValue, quantityEstimateUnit, message 
  } = parsed.data;

  const parsedProductIds = productIds ? productIds.split(",").filter(Boolean) : [];
  
  try {
    await prisma.rFQ.create({
      data: {
        name,
        company,
        country,
        email,
        phone,
        quantityEstimateValue: quantityEstimateValue ? parseFloat(quantityEstimateValue) : null,
        quantityEstimateUnit: quantityEstimateUnit || null,
        message: message || null,
        products: {
          connect: parsedProductIds.map(id => ({ id }))
        }
      }
    });

    // Fetch product names for the email notification
    const connectedProducts = parsedProductIds.length > 0 
      ? await prisma.product.findMany({
          where: { id: { in: parsedProductIds } },
          select: { name: true }
        })
      : [];

    try {
      const { sendRfqNotification } = await import("@/lib/email");
      await sendRfqNotification({
        name,
        company,
        country,
        email,
        phone,
        productNames: connectedProducts.map(p => p.name),
        quantityEstimateValue: quantityEstimateValue ? parseFloat(quantityEstimateValue) : null,
        quantityEstimateUnit: quantityEstimateUnit || null,
        message: message || null,
        submittedAt: new Date(), // using current time
      });
    } catch (emailError) {
      console.error("Failed to trigger RFQ notification email:", emailError);
      // We swallow this error so the form submission still succeeds for the user.
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to submit RFQ:", error);
    return {
      success: false,
      error: "Permintaan gagal terkirim karena ada gangguan di sistem kami. Coba lagi beberapa saat lagi."
    };
  }
}
