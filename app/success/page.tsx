"use client";

import { CheckCircle2, UserPlus, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUser, SignUpButton } from "@clerk/nextjs";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="relative z-10 max-w-lg text-center">
      {/* Sikeres fizetés ikon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#4285F4]/30 bg-[#4285F4]/15">
        <CheckCircle2 className="h-8 w-8 text-[#7BAAF7]" />
      </div>

      <h1 className="mt-6 text-3xl font-extrabold text-white lg:text-4xl">
        Sikeres fizetés!
      </h1>

      <p className="mt-4 leading-7 text-neutral-300">
        Köszönjük a rendelésed! A fizetés sikeresen lefutott, a visszaigazolást elküldtük e-mailben. Az NFC állványodat hamarosan csomagoljuk és indítjuk.
      </p>

      {/* Állapot ellenőrzése */}
      {!isLoaded ? (
        <div className="mt-8 text-neutral-400 text-sm">Betöltés...</div>
      ) : isSignedIn ? (
        /* HA A VÁSÁRLÓ BE VAN JEGYEZVE */
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/account#orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#4285F4] px-7 py-3.5 font-semibold text-white transition hover:bg-[#357AE8]"
          >
            <Package className="h-5 w-5" />
            Rendeléseim nyomon követése
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
          >
            Vissza a főoldalra
          </Link>
        </div>
      ) : (
        /* HA A VÁSÁRLÓ VENDÉGKÉNT VÁSÁROLT */
        <>
          <div className="mt-8 rounded-2xl border border-[#4285F4]/30 bg-[#4285F4]/10 p-6 text-left backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4285F4]/20 text-[#7BAAF7]">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Hozz létre fiókot 1 kattintással!</h3>
                <p className="text-xs text-neutral-400">Kövesd nyomon a csomagod állapotát</p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              Regisztrálj a vásárláskor megadott e-mail címeddel, hogy azonnal hozzáférj a rendelési adataidhoz, számláidhoz és a csomagkövetéshez!
            </p>

            <div className="mt-5">
              <SignUpButton mode="modal">
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#4285F4] px-6 py-3 font-semibold text-white transition hover:bg-[#357AE8]">
                  Fiók létrehozása
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SignUpButton>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="text-sm font-medium text-neutral-400 underline-offset-4 hover:text-white hover:underline transition"
            >
              Vissza a főoldalra
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-[#050816] px-6 py-28">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4285F4]/15 blur-[220px]" />
      </div>

      <Suspense fallback={<div className="relative z-10 text-white">Betöltés...</div>}>
        <SuccessContent />
      </Suspense>
    </section>
  );
}