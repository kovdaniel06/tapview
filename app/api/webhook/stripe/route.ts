import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmation } from "@/app/actions/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`❌ Webhook aláírás ellenőrzési hiba: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata || {};

    // Kiszűrjük az üres sztringeket
    const rawUserId = session.client_reference_id || meta.userId;
    const userId = (rawUserId && rawUserId.trim() !== "") ? rawUserId : null;

    let items: Array<{ name: string; quantity: number; price: number }> = [];
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ["data.price.product"],
      });

      items = lineItems.data.map((item) => {
        const unitPrice = item.price?.unit_amount
          ? item.price.unit_amount / 100
          : (item.amount_total ?? 0) / (item.quantity ?? 1) / 100;

        return {
          name: item.description || "NFC Kártya / Állvány",
          quantity: item.quantity || 1,
          price: unitPrice,
        };
      });
    } catch (lineItemErr) {
      console.warn("⚠️ Nem sikerült lekérni a line items-et:", lineItemErr);
    }

    const pickupPointId = meta.pickupPointId || "";
    let pickupPointName = meta.pickupPointName || "";
    const pickupPointAddress = meta.pickupPointAddress || "";
    
    if (pickupPointId && pickupPointName && !pickupPointName.includes(pickupPointId)) {
      pickupPointName = `${pickupPointName} (${pickupPointId})`;
    }

    const customerName = meta.customerName || session.customer_details?.name || "Vásárló";
    const customerEmail = meta.customerEmail || session.customer_details?.email || "";

    const orderPayload: Record<string, any> = {
      id: session.id,
      user_id: userId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: meta.customerPhone || session.customer_details?.phone || "",
      
      business_name: meta.businessName || "",
      google_maps_url: meta.googleMapsUrl || "",
      shipping_method: meta.shippingMethod || "home",
      
      shipping_postal_code: meta.shippingPostalCode || "",
      shipping_city: meta.shippingCity || "",
      shipping_address: meta.shippingAddress || "",

      pickup_point_name: pickupPointName,
      pickup_point_address: pickupPointAddress,
      
      billing_name: meta.billingName || "",
      billing_tax_number: meta.billingTaxNumber || "",
      billing_postal_code: meta.billingPostalCode || "",
      billing_city: meta.billingCity || "",
      billing_address: meta.billingAddress || "",
      
      total_amount: session.amount_total ? session.amount_total / 100 : 0,
      status: "PAID",
      items: items.length > 0 ? items : [{ name: meta.planName || "NFC Review Stand", quantity: 1, price: (session.amount_total || 0) / 100 }],
      
      raw_data: session, 
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Beszúrjuk az adatbázisba ÉS elkérjük a visszakapott order_number-t
      const { data: savedOrder, error } = await supabase
        .from("orders")
        .upsert(orderPayload, { onConflict: "id" })
        .select("order_number")
        .single();

      if (error) {
        console.error("❌ Supabase mentési hiba a webhookban:", error.message);
        return NextResponse.json({ received: true, dbError: error.message });
      }

      const orderNumber = savedOrder?.order_number || session.id.slice(-6);
      console.log(`✅ Rendelés sikeresen mentve! ID: ${session.id}, Rendelésszám: #${orderNumber}`);

      // 2. Összeállítjuk a teljes szállítási címet az e-mailhez
      const fullShippingAddress = [
        orderPayload.shipping_postal_code,
        orderPayload.shipping_city,
        orderPayload.shipping_address,
      ].filter(Boolean).join(" ");

      // 3. E-mail küldése a vásárlónak
      if (customerEmail) {
        const emailResult = await sendOrderConfirmation({
          email: customerEmail,
          customerName: customerName,
          orderNumber: orderNumber,
          totalAmount: orderPayload.total_amount,
          items: orderPayload.items,
          shippingMethod: orderPayload.shipping_method,
          shippingAddress: fullShippingAddress,
          pickupPointName: orderPayload.pickup_point_name,
          pickupPointAddress: orderPayload.pickup_point_address,
        });

        if (emailResult.success) {
          console.log(`📧 Visszaigazoló e-mail sikeresen elküldve ide: ${customerEmail}`);
        } else {
          console.error("❌ E-mail küldési hiba a webhookban:", emailResult.error);
        }
      } else {
        console.warn("⚠️ Nem található e-mail cím a rendelésnél, e-mail küldés kihagyva.");
      }

    } catch (dbErr: any) {
      console.error("❌ Váratlan szerver hiba:", dbErr.message);
      return NextResponse.json({ received: true, error: dbErr.message });
    }
  }

  return NextResponse.json({ received: true });
}