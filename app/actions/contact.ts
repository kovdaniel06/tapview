"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactForm(formData: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const { name, email, message } = formData;

    if (!name.trim() || !email.trim() || !message.trim()) {
      return { success: false, error: "Kérjük, tölts ki minden mezőt!" };
    }

    // E-mail küldése az ÜGYFÉLSZOLGÁLATNAK (Neked)
    const { data, error } = await resend.emails.send({
      from: "Tapview Weboldal <info@tapview.hu>", // Vagy a saját verifikált domained (pl. contact@tapview.hu)
      to: ["info@tapview.hu"], // <-- Ide érkezzen az üzenet (az ügyfélszolgálati e-mailed)
      replyTo: email, // <-- Ha a leveleződben rányomsz a 'Válasz'-ra, a vásárlónak válaszolsz!
      subject: `📩 Új megkeresés érkezett: ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background-color: #0B0F17; color: #E2E8F0; border-radius: 16px; border: 1px solid #1E293B;">
          
          <div style="margin-bottom: 20px;">
            <span style="background-color: #1E293B; color: #38BDF8; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
              Új weboldali üzenet
            </span>
          </div>

          <h2 style="color: #FFFFFF; font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">
            Új megkeresés érkezett a Footer űrlapról
          </h2>

          <div style="background-color: #161E2E; border: 1px solid #1E293B; padding: 16px; border-radius: 12px; margin-bottom: 16px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #94A3B8;">
              <strong style="color: #FFFFFF;">Küldő neve:</strong> ${name}
            </p>
            <p style="margin: 0; font-size: 14px; color: #94A3B8;">
              <strong style="color: #FFFFFF;">E-mail címe:</strong> 
              <a href="mailto:${email}" style="color: #38BDF8; text-decoration: none;">${email}</a>
            </p>
          </div>

          <div style="background-color: #161E2E; border: 1px solid #1E293B; padding: 16px; border-radius: 12px;">
            <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">
              Üzenet tartalma:
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #E2E8F0; white-space: pre-wrap;">${message}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #1E293B; margin: 24px 0 16px 0;" />

          <p style="font-size: 12px; color: #64748B; margin: 0; text-align: center;">
            💡 Erre az e-mailre közvetlenül válaszolva a vásárlónak (<strong>${email}</strong>) küldesz választ.
          </p>
        </div>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Kapcsolati űrlap hiba:", error);
    return { success: false, error: error.message || "Szerver hiba történt." };
  }
}