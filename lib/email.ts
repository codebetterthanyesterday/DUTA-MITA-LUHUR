import { Resend } from 'resend';

// Initialize Resend conditionally.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface ContactNotificationData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactNotification(data: ContactNotificationData) {
  if (!resend) {
    console.warn("⚠️  RESEND_API_KEY not configured. Skipping email notification for contact message.");
    return;
  }

  try {
    // Attempt to send email to the admin/recipient
    const recipientEmail = process.env.ADMIN_SEED_EMAIL || "info@dutamitaluhur.com";
    
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Replace with verified domain when going to production
      to: [recipientEmail],
      subject: `New Contact Message: ${data.subject || "No Subject"}`,
      html: `
        <h2>New Contact Message from ${data.name}</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject || "N/A"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br />')}</p>
      `,
    });
    
    console.log(`✓ Sent contact notification email to ${recipientEmail}`);
  } catch (error) {
    // Catch errors so it doesn't break the submission flow
    console.error("❌ Failed to send contact notification email:", error);
  }
}

export type RfqNotificationData = {
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  productNames: string[]; // empty array = general inquiry
  quantityEstimateValue: number | null;
  quantityEstimateUnit: string | null;
  message: string | null;
  submittedAt: Date;
};

export async function sendRfqNotification(data: RfqNotificationData) {
  if (!resend) {
    console.warn("⚠️  RESEND_API_KEY not configured. Skipping email notification for RFQ.");
    return;
  }

  try {
    const recipientEmail = process.env.ADMIN_SEED_EMAIL || "info@dutamitaluhur.com";
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.SITE_URL || "http://localhost:3000";
    const adminSlug = process.env.ADMIN_ROUTE_SLUG || "admin"; // Should be defined, but fallback to "admin" if somehow missing
    const adminRfqUrl = `${siteUrl}/${adminSlug}/rfq`;

    const productContext = data.productNames.length > 0 
      ? data.productNames.join(", ") 
      : "Pertanyaan Umum";

    const subject = `RFQ Baru: ${data.company} — ${productContext}`;

    const quantityBlock = data.quantityEstimateValue !== null
      ? `<p><strong>Kuantitas estimasi:</strong> ${data.quantityEstimateValue} ${data.quantityEstimateUnit}</p>`
      : "";

    const messageBlock = data.message
      ? `<p>${data.message.replace(/\n/g, '<br />')}</p>`
      : `<p><em>Tidak ada pesan tambahan</em></p>`;

    const html = `
      <h2>Permintaan Penawaran Baru</h2>
      
      <h3>Informasi Pembeli:</h3>
      <p><strong>Nama:</strong> ${data.name}</p>
      <p><strong>Perusahaan:</strong> ${data.company}</p>
      <p><strong>Negara:</strong> ${data.country}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      <p><strong>Telepon:</strong> ${data.phone}</p>
      
      <h3>Detail Permintaan:</h3>
      <p><strong>Produk terkait:</strong> ${data.productNames.length > 0 ? productContext : "Pertanyaan Umum (tidak terkait produk spesifik)"}</p>
      ${quantityBlock}
      
      <hr />
      
      <h3>Pesan:</h3>
      ${messageBlock}
      
      <br />
      <div style="margin: 20px 0;">
        <a href="${adminRfqUrl}" style="background-color: #0A192F; color: #FFFFFF; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Lihat & Tanggapi di Admin Panel</a>
      </div>
      
      <hr />
      <p style="font-size: 12px; color: #666666;">
        Dikirim pada: ${data.submittedAt.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
      </p>
    `;

    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Replace with verified domain when going to production
      to: [recipientEmail],
      subject,
      html,
    });
    
    console.log(`✓ Sent RFQ notification email to ${recipientEmail}`);
  } catch (error) {
    console.error("❌ Failed to send RFQ notification email:", error);
  }
}
