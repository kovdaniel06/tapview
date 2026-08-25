import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Hiányzó SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 }
    );
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Hiányzó rendelés azonosító (orderId)" },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "Rendelés nem található" },
        { status: 404 }
      );
    }

    const meta = order.raw_data?.metadata || {};
    const shippingMethod = order.shipping_method || meta.shippingMethod || "home";
    const carrier = meta.carrier || (shippingMethod === "pickup" ? "foxpost" : "gls");

    // 2. FOXPOST Automata
    if (carrier === "foxpost" || shippingMethod === "pickup") {
      const pickupPointId = meta.pickupPointId || order.pickup_point_id || "";

      if (!pickupPointId) {
        return NextResponse.json(
          { error: "Hiányzó Foxpost automata ID (pickupPointId)." },
          { status: 400 }
        );
      }

      const foxpostPayload = {
        destination: pickupPointId,
        recipientName: order.customer_name,
        recipientPhone: order.customer_phone,
        recipientEmail: order.customer_email,
        refCode: order.id.slice(0, 12),
      };

      const authHeader = Buffer.from(
        `${process.env.FOXPOST_USERNAME}:${process.env.FOXPOST_PASSWORD}`
      ).toString("base64");

      const foxpostRes = await fetch(
        `${process.env.FOXPOST_API_URL || "https://api.foxpost.hu/v2"}/parcels`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${authHeader}`,
          },
          body: JSON.stringify(foxpostPayload),
        }
      );

      if (!foxpostRes.ok) {
        const errorText = await foxpostRes.text();
        console.error("Foxpost API Hiba:", errorText);
        return NextResponse.json(
          { error: `Foxpost API hiba: ${foxpostRes.statusText}` },
          { status: 500 }
        );
      }

      const pdfBuffer = await foxpostRes.arrayBuffer();
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="foxpost-label-${order.id}.pdf"`,
        },
      });
    }

    // 3. GLS Házhozszállítás
    if (carrier === "gls" || shippingMethod === "home") {
      const glsPayload = {
        Username: process.env.GLS_USERNAME,
        Password: process.env.GLS_PASSWORD,
        ClientNumber: Number(process.env.GLS_CLIENT_NUMBER),
        ParcelList: [
          {
            ClientReference: order.id.slice(0, 12),
            Name: order.customer_name,
            Street: order.shipping_address || "",
            City: order.shipping_city || "",
            ZipCode: order.shipping_postal_code || "",
            CountryIsoCode: "HU",
            Phone: order.customer_phone,
            Email: order.customer_email,
            Count: 1,
          },
        ],
      };

      const glsRes = await fetch(
        `${process.env.GLS_API_URL || "https://api.mygls.hu/ParcelService.svc/json"}/PrintLabels`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(glsPayload),
        }
      );

      const glsData = await glsRes.json();

      // Ellenőrizzük az explicit hibákat a válaszban
      if (!glsRes.ok || glsData.PrintErrorList?.length > 0) {
        const errMsg = glsData.PrintErrorList?.[0]?.ErrorDescription || "GLS API hiba";
        console.error("GLS API Hiba:", errMsg, glsData);
        return NextResponse.json({ error: errMsg }, { status: 500 });
      }

      // Intelligens felderítés a MyGLS válaszstruktúrájához
      const pdfBase64 =
        glsData.PrintLabelsInfoList?.[0]?.Labels ||
        glsData.PrintLabelsInfoList?.[0]?.PdfData ||
        glsData.Labels?.[0] ||
        glsData.PdfData;

      if (!pdfBase64) {
        console.error("GLS Nem küldött PDF adatot. Válasz:", JSON.stringify(glsData));
        return NextResponse.json(
          { error: "A GLS nem küldött érvényes PDF címke adatot. Ellenőrizd a GLS azonosítókat és címadatokat." },
          { status: 500 }
        );
      }

      const pdfBuffer = Buffer.from(pdfBase64, "base64");

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="gls-label-${order.id}.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: "Ismeretlen szállítási mód" }, { status: 400 });
  } catch (err: any) {
    console.error("Csomagcímke hiba:", err);
    return NextResponse.json({ error: err.message || "Szerver hiba" }, { status: 500 });
  }
}