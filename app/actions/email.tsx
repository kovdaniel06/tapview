"use server";

import { Resend } from "resend";
import { render } from "@react-email/render";
import { OrderConfirmationEmail } from "@/components/emails/OrderConfirmationEmail";
import { InvoiceNotificationEmail } from "@/components/emails/InvoiceNotificationEmail";
import { AdminMessageEmail } from "@/components/emails/AdminMessageEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOrderConfirmationParams {
  email: string;
  customerName: string;
  orderNumber: number | string;
  totalAmount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingMethod?: string;
  shippingAddress?: string;
  pickupPointName?: string;
  pickupPointAddress?: string;
}

interface SendInvoiceNotificationParams {
  email: string;
  customerName: string;
  orderNumber: number | string;
  invoiceNumber: string;
  invoiceUrl: string;
  totalAmount: number;
}

interface SendAdminMessageParams {
  email: string;
  customerName: string;
  orderNumber?: number | string;
  subject: string;
  message: string;
}

// 1. Rendelés visszaigazoló e-mail
export async function sendOrderConfirmation({
  email,
  customerName,
  orderNumber,
  totalAmount,
  items,
  shippingMethod,
  shippingAddress,
  pickupPointName,
  pickupPointAddress,
}: SendOrderConfirmationParams) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tapview.hu";
    const orderUrl = `${siteUrl}/account#orders`;

    const emailHtml = await render(
      <OrderConfirmationEmail
        customerName={customerName}
        orderNumber={orderNumber}
        totalAmount={totalAmount}
        items={items}
        shippingMethod={shippingMethod}
        shippingAddress={shippingAddress}
        pickupPointName={pickupPointName}
        pickupPointAddress={pickupPointAddress}
        orderUrl={orderUrl}
      />
    );

    const { data, error } = await resend.emails.send({
      from: "Tapview <info@tapview.hu>",
      to: [email],
      subject: `Rendelés visszaigazolás - #ORD-${orderNumber}`,
      html: emailHtml,
    });

    if (error) {
      console.error("❌ Resend API hiba (rendelés):", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("❌ Váratlan e-mail küldési hiba (rendelés):", error?.message || error);
    return { success: false, error: error?.message || error };
  }
}

// 2. Számla értesítő e-mail
export async function sendInvoiceNotification({
  email,
  customerName,
  orderNumber,
  invoiceNumber,
  invoiceUrl,
  totalAmount,
}: SendInvoiceNotificationParams) {
  try {
    const emailHtml = await render(
      <InvoiceNotificationEmail
        customerName={customerName}
        orderNumber={orderNumber}
        invoiceNumber={invoiceNumber}
        invoiceUrl={invoiceUrl}
        totalAmount={totalAmount}
      />
    );

    const { data, error } = await resend.emails.send({
      from: "Tapview <info@tapview.hu>",
      to: [email],
      subject: `Számla a rendelésedhez - #${orderNumber}`,
      html: emailHtml,
    });

    if (error) {
      console.error("❌ Resend API hiba (számla):", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("❌ Váratlan e-mail küldési hiba (számla):", error?.message || error);
    return { success: false, error: error?.message || error };
  }
}

// 3. Admin által küldött egyedi üzenet a vásárlónak
export async function sendAdminMessage({
  email,
  customerName,
  orderNumber,
  subject,
  message,
}: SendAdminMessageParams) {
  try {
    const emailHtml = await render(
      <AdminMessageEmail
        customerName={customerName}
        orderNumber={orderNumber}
        message={message}
      />
    );

    const { data, error } = await resend.emails.send({
      from: "Tapview <info@tapview.hu>",
      to: [email],
      subject: subject,
      html: emailHtml,
    });

    if (error) {
      console.error("❌ Resend API hiba (admin üzenet):", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("❌ Váratlan e-mail küldési hiba (admin üzenet):", error?.message || error);
    return { success: false, error: error?.message || error };
  }
}