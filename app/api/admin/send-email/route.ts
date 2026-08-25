import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sendAdminMessage } from "@/app/actions/email";

export async function POST(req: Request) {
  // Bejelentkezés ellenőrzése (Clerk)
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Nincs bejelentkezve." }, { status: 401 });
  }

  // ❌ A felesleges/hibás publicMetadata.role === "admin" ellenőrzést eltávolítottuk!

  try {
    const { email, customerName, orderNumber, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Hiányzó adat: email cím, tárgy és üzenet megadása kötelező." },
        { status: 400 }
      );
    }

    const result = await sendAdminMessage({
      email,
      customerName: customerName || "Vásárló",
      orderNumber,
      subject,
      message,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Nem sikerült elküldeni az e-mailt." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error("Admin e-mail küldési hiba (API route):", error);
    return NextResponse.json(
      { error: error.message || "Ismeretlen hiba történt az e-mail küldésekor." },
      { status: 500 }
    );
  }
}