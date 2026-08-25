import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// 1. Rendelések lekérése szerver oldalon (megkerülve az RLS-t)
export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Hiányzó SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 2. Státusz módosítása
export async function PATCH(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Hiányzó SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
  }

  try {
    const { id, status } = await request.json();

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}