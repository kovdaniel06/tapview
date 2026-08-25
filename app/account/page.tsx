import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AccountClient from "./account-client";
import { supabaseAdmin } from "@/lib/supabase";

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // 💡 Auto-link vendég rendelések összekötése az e-mail cím alapján
  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (userEmail) {
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ user_id: user.id })
      .eq("customer_email", userEmail)
      .is("user_id", null);

    if (updateError) {
      console.error("Hiba a vendég rendelések összekötésekor:", updateError);
    }
  }

  // Rendelések lekérdezése a frissített user_id alapján
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Hiba a rendelések lekérésekor:", error);
  }

  const formattedOrders = (orders || []).map((order) => {
    // 💡 Metadata kiolvasása tartalékként
    const meta = order.metadata || order.raw_data?.metadata || {};

    // 💡 Intelligens számla URL keresés több lehetséges mezőben
    const invoiceUrl =
      order.invoice_url ||
      order.invoiceUrl ||
      meta.invoice_url ||
      meta.invoiceUrl ||
      meta.billingo_invoice_url ||
      "";

    return {
      id: order.id,
      orderNumber: order.order_number,
      totalAmount: Number(order.total_amount),
      currency: order.currency || "HUF",
      status: order.status,
      createdAt: order.created_at,
      businessName: order.business_name || meta.businessName || meta.business_name || "",
      googleMapsUrl: order.google_maps_url || meta.googleMapsUrl || "",
      shippingMethod: order.shipping_method,

      // Szállítási adatok (adatbázis oszlopokból vagy metadatából)
      shippingPostalCode: order.shipping_postal_code || meta.shippingPostalCode || meta.shipping_postal_code || "",
      shippingCity: order.shipping_city || meta.shippingCity || meta.shipping_city || "",
      shippingAddress: order.shipping_address || meta.shippingAddress || meta.shipping_address || "",

      pickupPointName: order.pickup_point_name || meta.pickupPointName || "",
      pickupPointAddress: order.pickup_point_address || meta.pickupPointAddress || "",

      // Számlázási adatok (adatbázis oszlopokból vagy metadatából)
      billingName: order.billing_name || meta.billingName || meta.billing_name || "",
      billingTaxNumber: order.billing_tax_number || meta.billingTaxNumber || meta.billing_tax_number || "",
      billingPostalCode: order.billing_postal_code || meta.billingPostalCode || meta.billing_postal_code || "",
      billingCity: order.billing_city || meta.billingCity || meta.billing_city || "",
      billingAddress: order.billing_address || meta.billingAddress || meta.billing_address || "",

      // Számla URL
      invoiceUrl: invoiceUrl,
      invoice_url: invoiceUrl,

      items: order.items || [],
    };
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] pt-3 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#4285F4]/10 blur-[180px]" />
      </div>

      {/* Szűkebb max-w-5xl konténer a tökéletes középső pozicionáláshoz */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-0">

        {/* FEJLÉC */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-neutral-300 backdrop-blur-md">
              Fiók
            </span>
            <h1 className="mt-2 text-2xl font-extrabold text-white tracking-tight">
              Fiókom
            </h1>
            <p className="text-neutral-400 text-xs mt-0.5">
              Kezeld a fiókbeállításaidat és tekintsd meg a korábbi rendeléseidet.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition backdrop-blur-md"
          >
            ← Vissza a főoldalra
          </Link>
        </div>

        {/* CLERK USERPROFILE KONTÉNER */}
        <div className="w-full flex justify-center">
          <AccountClient orders={formattedOrders} />
        </div>

      </div>
    </div>
  );
}