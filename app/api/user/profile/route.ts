import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json({ isLoggedIn: false }, { status: 200 });
    }

    // Clerk alapértelmezett adatok
    const email = user?.emailAddresses?.[0]?.emailAddress || "";
    const fullName = user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

    // Legutóbbi rendelés lekérése Supabase-ből az adott user_id alapján
    const { data: lastOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      isLoggedIn: true,
      profile: {
        fullName: fullName || lastOrder?.customer_name || "",
        email: email || lastOrder?.customer_email || "",
        phone: lastOrder?.customer_phone || "",
        businessName: lastOrder?.business_name || "",
        googleMapsUrl: lastOrder?.google_maps_url || "",
        // Szállítási címe
        shippingPostalCode: lastOrder?.shipping_postal_code || "",
        shippingCity: lastOrder?.shipping_city || "",
        shippingAddress: lastOrder?.shipping_address || "",
        // Számlázási címe
        billingName: lastOrder?.billing_name || "",
        billingTaxNumber: lastOrder?.billing_tax_number || "",
        billingPostalCode: lastOrder?.billing_postal_code || "",
        billingCity: lastOrder?.billing_city || "",
        billingAddress: lastOrder?.billing_address || "",
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ isLoggedIn: true, profile: null }, { status: 200 });
  }
}