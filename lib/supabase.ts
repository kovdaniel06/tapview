import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Warning: Supabase URL or Anon Key is missing in environment variables.");
}

// 1. Kliens oldali használatra (Böngésző / React komponensek)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Szerver oldali Admin kliens (API Route-ok, Webhookok - RLS megkerülésével)
if (typeof window === "undefined" && !supabaseServiceKey) {
  console.warn("⚠️ Warning: SUPABASE_SERVICE_ROLE_KEY is missing! Admin operations will fail RLS.");
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      persistSession: false, // Szerver oldalon ne tároljon session-t a memóriában
      autoRefreshToken: false,
    },
  }
);