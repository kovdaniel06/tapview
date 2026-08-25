import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const { userId } = await auth();

    const body = await req.json().catch(() => ({}));
    const { 
      selectedPlan, 
      items, 
      formData, 
      customerDetails, 
      shippingDetails, 
      billingDetails 
    } = body;

    // 1. Termék és ár meghatározása
    let planName = "";
    let amountInCents = 0;

    if (selectedPlan) {
      planName = selectedPlan.name;
      const rawPrice = typeof selectedPlan.price === "string" 
        ? parseInt(selectedPlan.price.replace(/,/g, ""), 10)
        : selectedPlan.priceNumber || selectedPlan.price;
      amountInCents = Math.round(rawPrice * 100);
    } else if (items && items.length > 0) {
      planName = items[0].name;
      amountInCents = Math.round(Number(items[0].price) * 100);
    } else {
      return NextResponse.json(
        { error: "Hiányzó csomag vagy termék adatok." },
        { status: 400 }
      );
    }

    // 2. Vásárló adatai
    const customerName = customerDetails?.name || formData?.fullName || formData?.customerName || user?.fullName || "Vásárló";
    const customerEmail = customerDetails?.email || formData?.email || formData?.customerEmail || user?.emailAddresses?.[0]?.emailAddress || "";
    const customerPhone = customerDetails?.phone || formData?.phone || formData?.customerPhone || "";
    
    const businessName = formData?.businessName || customerDetails?.businessName || "";
    const googleMapsUrl = formData?.googleMapsUrl || customerDetails?.googleMapsUrl || "";

    if (!customerEmail && !userId) {
      return NextResponse.json(
        { error: "Kérjük, jelentkezz be a vásárláshoz vagy add meg az email címed." },
        { status: 401 }
      );
    }

    // 3. Szállítási adatok
    const shippingMethod = shippingDetails?.method || formData?.shippingMethod || "home";
    const isPickup = shippingMethod === "pickup" || shippingMethod === "csomagpont";

    const pickupPoint = shippingDetails?.pickupPoint || formData?.pickupPoint || null;
    const pickupPointId = pickupPoint?.id || shippingDetails?.pickupPointId || "";
    const pickupPointName = pickupPoint?.name || shippingDetails?.pickupPointName || "";
    const pickupPointAddress = pickupPoint?.address || shippingDetails?.pickupPointAddress || "";
    
    const rawOperator = (pickupPoint?.operator || "").toLowerCase();
    let carrier = "gls";
    if (isPickup) {
      if (rawOperator.includes("foxpost") || pickupPointName.toLowerCase().includes("foxpost") || pickupPointId.includes("APT")) {
        carrier = "foxpost";
      } else if (rawOperator.includes("packeta") || pickupPointName.toLowerCase().includes("packeta")) {
        carrier = "packeta";
      } else {
        carrier = "foxpost";
      }
    }

    // Különálló szállítási mezők
    const shippingPostalCode = shippingDetails?.postalCode || formData?.postalCode || "";
    const shippingCity = shippingDetails?.city || formData?.city || "";
    const shippingAddress = shippingDetails?.address || formData?.address || "";

    // 4. Számlázási adatok
    const sameAsShipping = isPickup ? false : (billingDetails ? billingDetails.sameAsShipping : true);
    
    const billingName = sameAsShipping ? customerName : (billingDetails?.name || customerName);
    const billingTaxNumber = billingDetails?.taxNumber || formData?.taxNumber || "";
    
    const billingPostalCode = sameAsShipping ? shippingPostalCode : (billingDetails?.postalCode || "");
    const billingCity = sameAsShipping ? shippingCity : (billingDetails?.city || "");
    const billingAddress = sameAsShipping ? shippingAddress : (billingDetails?.address || "");

    // --- BIZTONSÁGOS BASE URL FELDOLGOZÁS ---
    // Kiszedi a markdown hivatkozásokat, szóközöket és záró perjeleket
    const rawEnvUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://tapview.hu";
    const cleanUrl = rawEnvUrl
      .replace(/\[.*?\]\((.*?)\)/g, "$1") // Ha markdown link lenne [url](url)
      .replace(/[()[\]'"\s]/g, "")         // Zárójelek, idézőjelek és szóközök eltávolítása
      .replace(/\/$/, "");                // Lezáró / eltávolítása

    const baseUrl = cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`;

    // Sikeres és megszakított URL-ek összeállítása
    const successUrl = userId 
      ? `${baseUrl}/account#orders` 
      : `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = `${baseUrl}/#pricing`;

    // 5. Stripe Session létrehozása
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "huf",
            product_data: {
              name: planName.includes("Pack") ? planName : `${planName} Pack`,
              description: "NFC Google Review Stand",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      metadata: {
        userId: userId || "",
        planName: planName,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        businessName: businessName,
        googleMapsUrl: googleMapsUrl,
        shippingMethod: isPickup ? "pickup" : "home",
        carrier: carrier,
        pickupPointId: pickupPointId,
        pickupPointName: pickupPointName,
        pickupPointAddress: pickupPointAddress,
        shippingPostalCode: shippingPostalCode,
        shippingCity: shippingCity,
        shippingAddress: shippingAddress,
        billingName: billingName,
        billingTaxNumber: billingTaxNumber,
        billingPostalCode: billingPostalCode,
        billingCity: billingCity,
        billingAddress: billingAddress,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Hiba történt a fizetési munkamenet létrehozásakor." },
      { status: 500 }
    );
  }
}