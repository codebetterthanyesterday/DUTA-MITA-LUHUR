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
