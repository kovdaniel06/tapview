import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createBillingoInvoice } from "@/lib/billingo";
import { sendInvoiceNotification } from "@/app/actions/email";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Hiányzó rendelés ID" }, { status: 400 });
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Rendelés nem található" }, { status: 404 });
    }

    if (order.invoice_id) {
      return NextResponse.json(
        { error: "Ennek a rendelésnek már ki van állítva a számlája!" },
        { status: 400 }
      );
    }

    // 1. Billingo számla kiállítása
    const invoiceResult = await createBillingoInvoice({
      customerName: order.customer_name || order.billing_name || order.business_name || "Vásárló",
      customerEmail: order.customer_email || "",
      billingName: order.billing_name || order.business_name,
      billingPostalCode: order.billing_postal_code,
      billingCity: order.billing_city,
      billingAddress: order.billing_address,
      billingTaxNumber: order.billing_tax_number,
      items: order.items || [
        {
          name: "NFC Review Stand / Kártya",
          quantity: 1,
          price: order.total_amount || 0,
        },
      ],
    });

    // 2. Supabase frissítése
    await supabaseAdmin
      .from("orders")
      .update({
        invoice_id: invoiceResult.invoiceId,
        invoice_url: invoiceResult.invoiceUrl,
        invoice_number: invoiceResult.invoiceNumber,
        status: "invoiced",
      })
      .eq("id", orderId);

    // 3. Számla értesítő e-mail kiküldése
    const recipientEmail = order.customer_email;
    if (recipientEmail) {
      const emailResult = await sendInvoiceNotification({
        email: recipientEmail,
        customerName: order.customer_name || "Vásárló",
        orderNumber: order.order_number || order.id.slice(-6),
        invoiceNumber: invoiceResult.invoiceNumber,
        invoiceUrl: invoiceResult.invoiceUrl,
        totalAmount: order.total_amount || 0,
      });

      if (emailResult.success) {
        console.log(`📧 Számla e-mail sikeresen elküldve ide: ${recipientEmail}`);
      } else {
        console.error("❌ E-mail küldési hiba a számlázás után:", emailResult.error);
      }
    } else {
      console.warn("⚠️ Nincs e-mail cím megadva a rendelésnél, e-mail küldés kihagyva.");
    }

    return NextResponse.json({
      success: true,
      invoiceId: invoiceResult.invoiceId,
      invoiceNumber: invoiceResult.invoiceNumber,
      invoiceUrl: invoiceResult.invoiceUrl,
    });
  } catch (err: any) {
    console.error("Számlázási API hiba:", err);
    return NextResponse.json(
      { error: err.message || "Hiba történt a számlázás során" },
      { status: 500 }
    );
  }
}