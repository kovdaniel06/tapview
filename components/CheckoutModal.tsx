"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, MapPin, Globe, ArrowRight, Truck, Receipt, CheckCircle2, UserCheck } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    name: string;
    price: string;
    priceNumber: number;
    unit: string;
  } | null;
}

// Segédfüggvény egybefüggő magyar cím felbontásához (pl. "8000 Varancsos, Fo setany 4")
function parseAddressString(fullAddressStr?: string) {
  if (!fullAddressStr) return { zip: "", city: "", street: "" };

  const trimmed = fullAddressStr.trim();
  // Regex a magyar irányítószám (4 számjegy) és város kiszűrésére
  const match = trimmed.match(/^(\d{4})\s+([^,]+),\s*(.+)$/);

  if (match) {
    return {
      zip: match[1],
      city: match[2].trim(),
      street: match[3].trim(),
    };
  }

  // Ha nem illeszkedik a pontos mintára, de az elején van 4 számjegy
  const altMatch = trimmed.match(/^(\d{4})\s+(.+)$/);
  if (altMatch) {
    return {
      zip: altMatch[1],
      city: "",
      street: altMatch[2].trim(),
    };
  }

  return { zip: "", city: "", street: trimmed };
}

export default function CheckoutModal({
  isOpen,
  onClose,
  selectedPlan,
}: CheckoutModalProps) {
  const { user, isSignedIn } = useUser();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    googleMapsUrl: "",

    // Szállítás: 'home' (Házhoz) vagy 'pickup' (Automata)
    shippingMethod: "home",
    zip: "",
    city: "",
    address: "",

    // Automata / Átvételi pont adatai
    selectedPickupPoint: null as {
      id: string;
      name: string;
      address: string;
      operator?: string;
    } | null,

    // Számlázás
    sameAsShipping: true,
    billingName: "",
    billingTaxNumber: "",
    billingZip: "",
    billingCity: "",
    billingAddress: "",

    // Jogi elfogadás
    termsAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // 1. BEJELENTKEZETT FELHASZNÁLÓ ADATAINAK AUTOMATIKUS ELŐTÖLTÉSE
  useEffect(() => {
    if (!isOpen) return;

    // A) Azonnali előtöltés Clerk-ből (Név és Email)
    if (isSignedIn && user) {
      const userFullName = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
      const userEmail = user.primaryEmailAddress?.emailAddress || "";

      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || userFullName,
        email: prev.email || userEmail,
      }));
    }

    // B) Korábbi rendelési adatok lekérése a Supabase-ből
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();

        if (data.isLoggedIn && data.profile) {
          const p = data.profile;

          // Szállítási cím intelligens felbontása, ha egyben van eltárolva
          const parsedShipping = parseAddressString(p.shippingAddress);
          const shipZip = p.shippingPostalCode || p.zip || parsedShipping.zip || "";
          const shipCity = p.shippingCity || p.city || parsedShipping.city || "";
          const shipAddress = (p.shippingAddress && !parsedShipping.street)
            ? p.shippingAddress
            : (parsedShipping.street || p.shippingAddress || "");

          // Számlázási cím felbontása
          const parsedBilling = parseAddressString(p.billingAddress);
          const billZip = p.billingPostalCode || p.billingZip || parsedBilling.zip || "";
          const billCity = p.billingCity || parsedBilling.city || "";
          const billAddress = (p.billingAddress && !parsedBilling.street)
            ? p.billingAddress
            : (parsedBilling.street || p.billingAddress || "");

          setFormData((prev) => ({
            ...prev,
            fullName: prev.fullName || p.fullName || "",
            email: prev.email || p.email || "",
            phone: prev.phone || p.phone || "",
            businessName: prev.businessName || p.businessName || "",
            googleMapsUrl: prev.googleMapsUrl || p.googleMapsUrl || "",
            zip: prev.zip || shipZip,
            city: prev.city || shipCity,
            address: prev.address || shipAddress,
            billingName: prev.billingName || p.billingName || "",
            billingTaxNumber: prev.billingTaxNumber || p.billingTaxNumber || "",
            billingZip: prev.billingZip || billZip,
            billingCity: prev.billingCity || billCity,
            billingAddress: prev.billingAddress || billAddress,
          }));
          setIsAutoFilled(true);
        }
      } catch (err) {
        console.error("Nem sikerült előtölteni a profil adatokat:", err);
      }
    };

    if (isSignedIn) {
      fetchUserProfile();
    }
  }, [isOpen, isSignedIn, user]);

  // Foxpost / AptFinder iframe üzenetkezelő
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      let data = event.data;

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          return;
        }
      }

      if (!data || typeof data !== "object") return;

      if (
        data.action === "foxpost" ||
        data.operator === "foxpost" ||
        data.place_id ||
        (data.name && (data.address || data.zip))
      ) {
        const pointName = data.name || data.place_name || "Kiválasztott automata";
        const pointAddress =
          data.address ||
          (data.zip && data.city
            ? `${data.zip} ${data.city}, ${data.street || ""}`
            : pointName);

        setFormData((prev) => ({
          ...prev,
          selectedPickupPoint: {
            id: String(data.id || data.place_id || data.operator_id || "foxpost_point"),
            name: pointName,
            address: pointAddress,
            operator: data.operator || "Foxpost",
          },
        }));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!isOpen || !selectedPlan) return null;

  const handleShippingMethodChange = (method: "home" | "pickup") => {
    setFormData((prev) => ({
      ...prev,
      shippingMethod: method,
      sameAsShipping: method === "pickup" ? false : true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.shippingMethod === "pickup" && !formData.selectedPickupPoint) {
      setError("Kérjük válaszd ki az átvételi pontot a térképről!");
      return;
    }

    if (!formData.termsAccepted) {
      setError("A rendelés véglegesítéséhez el kell fogadnod az ÁSZF-et és az Adatvédelmi tájékoztatót.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPlan,
          customerDetails: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
          shippingDetails: {
            method: formData.shippingMethod,
            postalCode: formData.shippingMethod === "home" ? formData.zip : "",
            city: formData.shippingMethod === "home" ? formData.city : "",
            address: formData.shippingMethod === "home" ? formData.address : "",
            pickupPoint: formData.shippingMethod === "pickup" ? formData.selectedPickupPoint : null,
          },
          billingDetails: {
            sameAsShipping: formData.sameAsShipping,
            name: formData.billingName,
            taxNumber: formData.billingTaxNumber,
            postalCode: formData.billingZip,
            city: formData.billingCity,
            address: formData.billingAddress,
          },
          formData: {
            businessName: formData.businessName,
            googleMapsUrl: formData.googleMapsUrl,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "A fizetés indítása nem sikerült.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Váratlan hiba történt. Kérjük próbáld újra!");
      setIsSubmitting(false);
    }
  };

  const showSameAsShippingOption = formData.shippingMethod === "home";
  const showBillingFields = !formData.sameAsShipping || !showSameAsShippingOption;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0B0F24] p-6 md:p-8 text-white shadow-2xl custom-scrollbar"
        >
          {/* Bezáró gomb */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-5 right-5 z-10 rounded-full bg-white/5 p-2 text-neutral-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Fejléc */}
          <div className="border-b border-white/10 pb-5 pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7BAAF7] uppercase tracking-wider">
                <Package className="h-4 w-4" /> Kiválasztott csomag
              </span>
              {isSignedIn && isAutoFilled && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <UserCheck className="h-3 w-3" /> Adatok kitöltve a fiókodból
                </span>
              )}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <h2 className="text-2xl font-bold">{selectedPlan.name} Pack</h2>
              <p className="text-2xl font-extrabold text-[#7BAAF7]">
                {selectedPlan.price} {selectedPlan.unit}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* 1. Cég adatai */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-300">
                <Globe className="h-4 w-4 text-[#4285F4]" />
                1. Cég & Google Értékelő
              </h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Vállalkozás neve *</label>
                  <input
                    type="text"
                    required
                    autoComplete="organization"
                    placeholder="pl. Milano Kávézó"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#4285F4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Google Értékelés Link (Opcionális)</label>
                  <input
                    type="url"
                    autoComplete="off"
                    placeholder="https://g.page/r/..."
                    value={formData.googleMapsUrl}
                    onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#4285F4] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Kapcsolattartó */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-300">
                <MapPin className="h-4 w-4 text-[#4285F4]" />
                2. Kapcsolattartó Adatai
              </h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Teljes Név *</label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Kovács János"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#4285F4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">E-mail cím *</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="janos@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#4285F4] focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-neutral-400 mb-1">Telefonszám (futár értesítőhöz) *</label>
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+36 30 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#4285F4] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Szállítási mód választása */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-3">
                <Truck className="h-4 w-4 text-[#4285F4]" />
                3. Szállítási Mód
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {/* GLS Házhoz */}
                <label className={`flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition ${formData.shippingMethod === 'home' ? 'border-[#4285F4] bg-[#4285F4]/10' : 'border-white/10 bg-white/5'}`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="home"
                      checked={formData.shippingMethod === 'home'}
                      onChange={() => handleShippingMethodChange('home')}
                      className="accent-[#4285F4]"
                    />
                    <span className="text-sm font-bold text-white">GLS Házhozszállítás</span>
                  </div>
                  <span className="text-xs text-neutral-400 mt-1">1-2 munkanap</span>
                </label>

                {/* Csomagautomata / Átvételi pont */}
                <label className={`flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition ${formData.shippingMethod === 'pickup' ? 'border-[#4285F4] bg-[#4285F4]/10' : 'border-white/10 bg-white/5'}`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="pickup"
                      checked={formData.shippingMethod === 'pickup'}
                      onChange={() => handleShippingMethodChange('pickup')}
                      className="accent-[#4285F4]"
                    />
                    <span className="text-sm font-bold text-white">Csomagautomata / Átvételi pont</span>
                  </div>
                  <span className="text-xs text-neutral-400 mt-1">Kiválasztás térképről</span>
                </label>
              </div>

              {/* Házhozszállítás Címmezők */}
              {formData.shippingMethod === 'home' && (
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Irányítószám *</label>
                    <input
                      type="text"
                      required
                      autoComplete="postal-code"
                      inputMode="numeric"
                      placeholder="1051"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#4285F4] focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-neutral-400 mb-1">Város *</label>
                    <input
                      type="text"
                      required
                      autoComplete="address-level2"
                      placeholder="Budapest"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#4285F4] focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs text-neutral-400 mb-1">Utca, házszám *</label>
                    <input
                      type="text"
                      required
                      autoComplete="address-line1"
                      placeholder="Fő utca 12."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#4285F4] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* CSOMAGAUTOMATA TÉRKÉP ÉS VISSZAJELZŐ KÁRTYA */}
              {formData.shippingMethod === 'pickup' && (
                <div className="space-y-3">
                  {formData.selectedPickupPoint ? (
                    <div className="p-4 rounded-2xl bg-[#4285F4]/10 border border-[#4285F4] flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#4285F4] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-[#7BAAF7]">Kiválasztott átvételi pont:</p>
                          <p className="text-sm font-bold text-white mt-0.5">{formData.selectedPickupPoint.name}</p>
                          <p className="text-xs text-neutral-300 mt-1">{formData.selectedPickupPoint.address}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, selectedPickupPoint: null })}
                        className="text-xs text-neutral-400 underline hover:text-white cursor-pointer"
                      >
                        Másik választása
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white h-[450px]">
                      <iframe
                        src="https://cdn.foxpost.hu/apt-finder/v1/app/"
                        className="w-full h-full border-0"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. Számlázási adatok */}
            <div className="border-t border-white/10 pt-4">
              {showSameAsShippingOption && (
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={formData.sameAsShipping}
                    onChange={(e) => setFormData({ ...formData, sameAsShipping: e.target.checked })}
                    className="accent-[#4285F4] rounded h-4 w-4"
                  />
                  <span className="text-xs text-neutral-300">
                    A számlázási cím megegyezik a szállítási címmel
                  </span>
                </label>
              )}

              {!showSameAsShippingOption && (
                <p className="text-xs text-neutral-400 mb-3">
                  Csomagautomatás átvételnél a számlázási adatokat külön meg kell adnod, mivel nincs önálló szállítási cím.
                </p>
              )}

              {showBillingFields && (
                <div className="mt-3 p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                  <h4 className="flex items-center gap-2 text-xs font-semibold text-[#7BAAF7] uppercase tracking-wider">
                    <Receipt className="h-3.5 w-3.5" /> Számlázási adatok
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-neutral-400 mb-1">Számlázási név / Cégnév *</label>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Név vagy Cég Kft."
                        value={formData.billingName}
                        onChange={(e) => setFormData({ ...formData, billingName: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#4285F4] focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-neutral-400 mb-1">Adószám (cég esetén)</label>
                      <input
                        type="text"
                        placeholder="12345678-1-12"
                        value={formData.billingTaxNumber}
                        onChange={(e) => setFormData({ ...formData, billingTaxNumber: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#4285F4] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1">Irányítószám *</label>
                      <input
                        type="text"
                        required
                        autoComplete="postal-code"
                        inputMode="numeric"
                        placeholder="1051"
                        value={formData.billingZip}
                        onChange={(e) => setFormData({ ...formData, billingZip: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#4285F4] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1">Város *</label>
                      <input
                        type="text"
                        required
                        autoComplete="address-level2"
                        placeholder="Budapest"
                        value={formData.billingCity}
                        onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#4285F4] focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-neutral-400 mb-1">Cím *</label>
                      <input
                        type="text"
                        required
                        autoComplete="address-line1"
                        placeholder="Fő utca 12."
                        value={formData.billingAddress}
                        onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#4285F4] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Jogi elfogadás — ÁSZF / Adatvédelem */}
            <div className="border-t border-white/10 pt-4">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="accent-[#4285F4] rounded h-4 w-4 mt-0.5"
                />
                <span className="text-xs text-neutral-300 leading-5">
                  Elolvastam és elfogadom az{" "}
                  <Link href="/policy/terms" target="_blank" className="text-[#7BAAF7] hover:underline font-medium">
                    Általános Szerződési Feltételeket
                  </Link>{" "}
                  és az{" "}
                  <Link href="/policy/privacy" target="_blank" className="text-[#7BAAF7] hover:underline font-medium">
                    Adatvédelmi Tájékoztatót
                  </Link>
                  . *
                </span>
              </label>
            </div>

            {/* Hibaüzenet ha van */}
            {error && (
              <p className="text-center text-sm font-medium text-red-400 bg-red-500/10 py-2.5 rounded-xl border border-red-500/20">
                {error}
              </p>
            )}

            {/* Gomb */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#4285F4] px-6 py-4 font-semibold text-white transition hover:bg-[#357AE8] shadow-lg shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Átirányítás a fizetéshez..." : "Tovább a fizetéshez"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}