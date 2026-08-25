const BILLINGO_API_URL = "https://api.billingo.hu/v3";

export async function createBillingoInvoice(data: {
  customerName: string;
  customerEmail: string;
  billingName?: string;
  billingPostalCode?: string;
  billingCity?: string;
  billingAddress?: string;
  billingTaxNumber?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}) {
  const apiKey = process.env.BILLINGO_API_KEY;
  if (!apiKey) {
    throw new Error("BILLINGO_API_KEY hiányzik a környezeti változókból!");
  }

  const blockId = process.env.BILLINGO_BLOCK_ID
    ? Number(process.env.BILLINGO_BLOCK_ID)
    : 327590;

  // 1. Különálló mezők használata (tisztán és pontosan)
  const postalCode = data.billingPostalCode || "1000";
  const city = data.billingCity || "Budapest";
  const address = data.billingAddress || "Fő utca 1.";

  // 2. Partner adatok előkészítése
  const partnerBody: any = {
    name: data.billingName || data.customerName,
    address: {
      country_code: "HU",
      post_code: postalCode,
      city: city,
      address: address,
    },
    emails: [data.customerEmail],
  };

  if (data.billingTaxNumber && data.billingTaxNumber.trim() !== "") {
    partnerBody.tax_number = data.billingTaxNumber.trim();
  }

  const partnerResponse = await fetch(`${BILLINGO_API_URL}/partners`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(partnerBody),
  });

  const partnerData = await partnerResponse.json();
  if (!partnerResponse.ok) {
    console.error("Billingo partner hiba:", partnerData);
    throw new Error(partnerData.message || "Hiba a Billingo partner létrehozásakor");
  }

  const partnerId = partnerData.id;

  // 3. Tételek összeállítása
  const documentItems = data.items.map((item) => {
    const grossPrice = item.price;
    const netUnitPrice = Math.round((grossPrice / 1.27) * 100) / 100;

    return {
      name: item.name,
      unit_price: netUnitPrice,
      unit_price_type: "net",
      quantity: item.quantity,
      unit: "db",
      vat: "27%",
    };
  });

  const today = new Date().toISOString().split("T")[0];

  // 4. Számla dokumentum
  const docBody = {
    partner_id: partnerId,
    block_id: blockId,
    type: "invoice",
    fulfillment_date: today,
    due_date: today,
    payment_method: "online_bankcard",
    language: "hu",
    currency: "HUF",
    paid: true,
    items: documentItems,
  };

  const docResponse = await fetch(`${BILLINGO_API_URL}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(docBody),
  });

  const docData = await docResponse.json();
  if (!docResponse.ok) {
    console.error("Billingo számla hiba:", docData);
    throw new Error(docData.message || "Hiba a Billingo számla kiállításakor");
  }

  let publicUrl = "";
  try {
    const urlRes = await fetch(
      `${BILLINGO_API_URL}/documents/${docData.id}/public-url`,
      { headers: { "X-API-KEY": apiKey } }
    );
    if (urlRes.ok) {
      const urlData = await urlRes.json();
      publicUrl = urlData.public_url || "";
    }
  } catch (e) {
    console.warn("Nem sikerült lekérni a public-url-t a Billingóból:", e);
  }

  return {
    invoiceId: docData.id,
    invoiceNumber: docData.invoice_number,
    invoiceUrl: publicUrl,
  };
}