"use client";

import { UserProfile, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export type Order = {
  id: string;
  orderNumber?: number | string;
  stripeSessionId?: string;
  totalAmount?: number;
  currency?: string;
  status?: string;
  createdAt?: Date | string;
  businessName?: string;
  googleMapsUrl?: string;
  shippingMethod?: string;

  // Szállítási adatok
  shippingPostalCode?: string;
  shippingCity?: string;
  shippingAddress?: string;

  pickupPointName?: string;
  pickupPointAddress?: string;

  // Számlázási adatok
  billingName?: string;
  billingTaxNumber?: string;
  billingPostalCode?: string;
  billingCity?: string;
  billingAddress?: string;

  invoiceUrl?: string;
  invoicePdfUrl?: string;
  invoicePdf?: string;
  invoice_url?: string;
  items?: {
    name: string;
    quantity?: number;
    price?: number;
  }[];
};

const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
  </svg>
);

const PackageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TruckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1h2.586a1 1 0 00.707-.293l3.414-3.414a1 1 0 00.293-.707V11a1 1 0 00-1-1h-1m-6-4l5 5" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

/**
 * Segédfüggvény a teljes cím formázásához irányítószám, város és utca/házszám alapján.
 */
function formatFullAddress(postalCode?: string, city?: string, address?: string) {
  const locationParts = [postalCode, city].filter(Boolean).join(" ");
  const fullParts = [locationParts, address].filter(Boolean).join(", ");
  return fullParts || null;
}

function OrderTracker({ status = "PAID" }: { status?: string }) {
  const currentStatus = status ? status.toUpperCase() : "PAID";

  if (currentStatus === "CANCELLED") {
    return (
      <div className="bg-rose-950/60 border border-rose-500/40 text-rose-300 p-3 rounded-2xl text-xs font-semibold text-center">
        ❌ Ez a megrendelés törölve lett.
      </div>
    );
  }

  const steps = [
    { key: "PAID", label: "Fizetve", icon: CheckCircleIcon },
    { key: "PROCESSING", label: "Feldolgozás", icon: PackageIcon },
    { key: "SHIPPED", label: "Úton van", icon: TruckIcon },
    { key: "DELIVERED", label: "Kiszállítva", icon: HomeIcon },
  ];

  const getStepIndex = (s: string) => {
    switch (s) {
      case "PAID":
      case "INVOICED":
      case "PENDING":
        return 0;
      case "PROCESSING":
        return 1;
      case "SHIPPED":
        return 2;
      case "DELIVERED":
      case "COMPLETED":
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="bg-white/[0.04] border border-white/10 p-4 rounded-2xl space-y-3 backdrop-blur-xl">
      <div className="flex items-center justify-between text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
        <span>Rendelés állapota</span>
        <span className="text-[#7BAAF7] font-semibold lowercase">
          {activeIndex === 3 ? "Teljesítve" : "Folyamatban"}
        </span>
      </div>

      <div className="relative flex items-center justify-between">
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-white/10 -z-0" />
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-[#4285F4] transition-all duration-500 -z-0"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 88}%` }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? "bg-[#4285F4] text-white ring-4 ring-[#4285F4]/25"
                    : "bg-white/5 border-2 border-white/15 text-neutral-300"
                } ${isCurrent ? "scale-110 shadow-md shadow-blue-500/40" : ""}`}
              >
                <Icon />
              </div>
              <span
                className={`text-[11px] font-semibold whitespace-nowrap ${
                  isDone ? "text-white" : "text-neutral-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status = "PENDING" }: { status?: string }) {
  const safeStatus = status ? status.toUpperCase() : "PENDING";

  const getStatusStyle = (s: string) => {
    switch (s) {
      case "COMPLETED":
      case "DELIVERED":
        return "bg-emerald-500 text-white border-emerald-400/50";
      case "PAID":
      case "INVOICED":
        return "bg-[#4285F4] text-white border-[#4285F4]/50";
      case "SHIPPED":
        return "bg-purple-500 text-white border-purple-400/50";
      case "PROCESSING":
        return "bg-amber-500 text-black border-amber-400/50";
      case "CANCELLED":
        return "bg-rose-500 text-white border-rose-400/50";
      default:
        return "bg-white/10 text-white border-white/20";
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case "PAID":
      case "INVOICED":
        return "Fizetve";
      case "PROCESSING":
        return "Feldolgozás alatt";
      case "SHIPPED":
        return "Futárnak átadva";
      case "DELIVERED":
      case "COMPLETED":
        return "Kiszállítva";
      case "CANCELLED":
        return "Törölve";
      default:
        return s;
    }
  };

  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border shadow-sm ${getStatusStyle(safeStatus)}`}>
      {getStatusLabel(safeStatus)}
    </span>
  );
}

function OrdersTab({ orders }: { orders: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="space-y-6 text-white">
      <div>
        <h2 className="text-xl font-bold text-white">Rendeléseim</h2>
        <p className="text-xs text-neutral-300 mt-1">
          Tekintsd meg a korábbi megrendeléseidet és azok élő státuszát.
        </p>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="border border-white/10 rounded-2xl p-8 text-center space-y-3 bg-white/[0.04] backdrop-blur-xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-white">
            <ShoppingBagIcon />
          </div>
          <p className="text-white font-medium">Még nincs leadott rendelésed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const formattedTotal = (order.totalAmount ?? 0).toLocaleString("hu-HU");
            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("hu-HU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Ismeretlen dátum";

            const displayNum = order.orderNumber
              ? `#ORD-${order.orderNumber}`
              : `#${order.id.slice(0, 8)}`;

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                className="border border-white/10 rounded-2xl p-4 bg-white/[0.04] backdrop-blur-xl hover:border-white/25 hover:bg-white/[0.07] transition space-y-3 cursor-pointer group"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <p className="text-xs font-mono font-bold text-[#7BAAF7]">
                      {displayNum}
                    </p>
                    <p className="text-xs text-neutral-300 mt-0.5">{formattedDate}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="space-y-1 py-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-white">
                          {item.quantity || 1}x {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-white/10 text-sm font-semibold">
                  <span className="text-neutral-300 text-xs">Végösszeg:</span>
                  <span className="text-white font-bold">
                    {formattedTotal} {order.currency || "HUF"}
                  </span>
                </div>

                <div className="text-right text-xs text-[#7BAAF7] font-medium group-hover:underline">
                  Részletek megtekintése →
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RÉSZLETES MODÁL */}
      {selectedOrder && (() => {
        const activeInvoiceUrl = 
          selectedOrder.invoiceUrl || 
          selectedOrder.invoicePdfUrl || 
          selectedOrder.invoicePdf || 
          selectedOrder.invoice_url;

        // Szállítási és számlázási teljes címek összeállítása
        const fullShippingAddress = formatFullAddress(
          selectedOrder.shippingPostalCode,
          selectedOrder.shippingCity,
          selectedOrder.shippingAddress
        );

        const fullBillingAddress = formatFullAddress(
          selectedOrder.billingPostalCode,
          selectedOrder.billingCity,
          selectedOrder.billingAddress
        );

        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#0B0F24] border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 text-left shadow-2xl relative">

              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono text-[#7BAAF7] font-bold">
                    {selectedOrder.orderNumber ? `#ORD-${selectedOrder.orderNumber}` : `#${selectedOrder.id}`}
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">Rendelés részletei</h3>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Dátum: {new Date(selectedOrder.createdAt || "").toLocaleString("hu-HU")}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white hover:text-neutral-200 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* STÁTUSZ TRACKER */}
              <OrderTracker status={selectedOrder.status} />

              {/* MEGRENDELT TERMÉKEK */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
                    Megrendelt Termékek
                  </span>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-white font-semibold">{item.quantity || 1}x {item.name}</span>
                      <span className="text-white font-bold">{((item.price || selectedOrder.totalAmount || 0)).toLocaleString("hu-HU")} Ft</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 flex justify-between items-center text-sm font-bold text-white mt-2">
                    <span>Összesen fizetve:</span>
                    <span className="text-[#7BAAF7] font-mono text-base">{selectedOrder.totalAmount?.toLocaleString("hu-HU")} Ft</span>
                  </div>
                </div>
              )}

              {/* VÁLLALKOZÁS ADATAI */}
              {selectedOrder.businessName && (
                <div className="bg-white/[0.04] p-4 rounded-2xl space-y-1 border border-white/10">
                  <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                    Vállalkozás adatai
                  </span>
                  <div className="text-white font-bold">{selectedOrder.businessName}</div>
                  {selectedOrder.googleMapsUrl && (
                    <a
                      href={selectedOrder.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#7BAAF7] hover:underline inline-flex items-center gap-1 mt-1 font-medium truncate"
                    >
                      Google Cégem profil link ↗
                    </a>
                  )}
                </div>
              )}

              {/* SZÁLLÍTÁSI ADATOK */}
              <div className="bg-white/[0.04] p-4 rounded-2xl space-y-1 border border-white/10">
                <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                  Szállítási adatok
                </span>
                <div className="text-emerald-400 text-xs font-bold uppercase tracking-wide">
                  {selectedOrder.pickupPointName ? "Csomagautomata / Átvételi pont" : "GLS Házhozszállítás"}
                </div>
                <div className="text-white text-sm font-medium mt-1">
                  {selectedOrder.pickupPointName || fullShippingAddress || "Nincs megadva"}
                </div>
                {selectedOrder.pickupPointAddress && (
                  <div className="text-xs text-neutral-300 mt-0.5">{selectedOrder.pickupPointAddress}</div>
                )}
              </div>

              {/* SZÁMLÁZÁSI ADATOK */}
              {selectedOrder.billingName && (
                <div className="bg-white/[0.04] p-4 rounded-2xl space-y-1 border border-white/10">
                  <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                    Számlázási adatok
                  </span>
                  <div className="text-white text-sm font-medium">{selectedOrder.billingName}</div>
                  {selectedOrder.billingTaxNumber && (
                    <div className="text-xs text-neutral-300">Adószám: {selectedOrder.billingTaxNumber}</div>
                  )}
                  {fullBillingAddress && (
                    <div className="text-xs text-neutral-300">{fullBillingAddress}</div>
                  )}
                </div>
              )}

              {/* 📄 ELEKTRONIKUS SZÁMLA SZEKCIÓ */}
              <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 space-y-3">
                <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
                  Számla
                </span>
                {activeInvoiceUrl ? (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg">
                        <FileTextIcon />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Elektronikus számla</div>
                        <div className="text-[11px] text-emerald-400">Letöltésre kész (PDF)</div>
                      </div>
                    </div>
                    <a
                      href={activeInvoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-500/20"
                    >
                      <DownloadIcon />
                      <span>Letöltés</span>
                    </a>
                  </div>
                ) : (
                  <div className="text-xs text-neutral-400 bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2">
                    <FileTextIcon />
                    <span>Még nincs kiállítva számla ehhez a rendeléshez.</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-[#4285F4] hover:bg-[#357AE8] text-white font-bold py-3 rounded-2xl transition cursor-pointer text-sm shadow-lg shadow-blue-500/25"
              >
                Bezárás
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default function AccountClient({ orders = [] }: { orders?: Order[] }) {
  const { isLoaded, isSignedIn } = useUser();

  // 1. Töltési állapot kezelése
  if (!isLoaded) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center text-neutral-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-[#4285F4]" />
        <span className="text-sm font-medium">Fiókadatok betöltése...</span>
      </div>
    );
  }

  // 2. Biztonsági ellenőrzés: ha nincs bejelentkezve, nem rendereljük a UserProfile-t
  if (!isSignedIn) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center text-neutral-400 p-6 text-center">
        <p className="text-base font-medium text-white">A fiók megtekintéséhez be kell jelentkezned.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <style jsx global>{`
        .cl-badge, [class*="cl-badge"] {
          background-color: #4285F4 !important;
          color: #ffffff !important;
          font-weight: 700 !important;
        }
        button[data-localization-key*="action"], 
        .cl-userButton-trigger,
        [class*="cl-actionRow"] button,
        button[aria-haspopup="menu"] {
          color: #ffffff !important;
        }
        button[aria-haspopup="menu"] svg,
        [class*="cl-actions"] svg,
        [class*="cl-profileSectionItem"] svg,
        [class*="cl-menuButton"] svg,
        button[data-localization-key*="accessibility"] svg {
          color: #ffffff !important;
          fill: #ffffff !important;
        }
        [class*="cl-menuList"], [class*="cl-popover"], [class*="cl-select__option"], [class*="cl-actionMenu"] {
          background-color: #0B0F24 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
        }
        [class*="cl-menuItem"], [class*="cl-select__option"], [class*="cl-actionListItem"] {
          color: #ffffff !important;
        }
        [class*="cl-menuItem"]:hover, [class*="cl-select__option"]:hover, [class*="cl-actionListItem"]:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
        }
      `}</style>

      <UserProfile
        routing="hash"
        appearance={{
          variables: {
            colorPrimary: "#4285F4",
            colorBackground: "#0B0F24",
            colorForeground: "#FFFFFF",
            colorMutedForeground: "#D1D5DB",
            colorInput: "rgba(255,255,255,0.06)",
            colorInputForeground: "#FFFFFF",
            colorDanger: "#F87171",
            colorSuccess: "#34D399",
            colorWarning: "#FBBF24",
            borderRadius: "16px",
            fontFamily: "Inter, ui-sans-serif, sans-serif",
          },
          elements: {
            rootBox: "w-full min-h-fit",
            cardBox: "w-full max-w-full shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-[#0B0F24] my-2",
            card: "w-full min-h-[500px] border-0 shadow-none bg-transparent text-white",
            navbar: "w-60 border-r border-white/10 bg-white/[0.02] p-2",
            navbarButton: "text-white font-medium hover:text-white hover:bg-white/10 transition rounded-xl",
            navbarButtonIcon: "text-[#7BAAF7]",
            navbarMobileMenuButton: "bg-white/10 text-white border border-white/10",
            navbarMobileMenuButtonIcon: "text-white",
            pageScrollBox: "p-4 md:p-6 bg-[#0B0F24] text-white",
            headerTitle: "text-white font-extrabold text-lg",
            headerSubtitle: "text-neutral-300 text-xs",
            
            profileSection: "border-b border-white/10 pb-4 mb-4",
            profileSectionTitle: "text-white font-bold text-sm mb-3",
            profileSectionTitleText: "text-white font-bold text-sm",
            profileSectionContent: "text-white bg-white/[0.03] border border-white/10 p-3 rounded-xl",
            profileSectionItem: "border-b border-white/10 pb-3 mb-3 last:border-none last:pb-0 last:mb-0 text-white",
            
            formFieldLabel: "text-white font-semibold text-xs",
            formFieldInput: "border border-white/20 bg-white/5 text-white focus:border-[#4285F4] rounded-xl px-3 py-2 text-sm placeholder:text-neutral-500",
            formFieldHintText: "text-neutral-400 text-xs",
            
            formButtonPrimary: "bg-[#4285F4] hover:bg-[#357AE8] shadow-lg shadow-blue-500/25 text-xs normal-case font-bold text-white px-4 py-2.5 rounded-xl transition-all",
            formButtonReset: "text-white hover:bg-white/10 rounded-xl text-xs",
            profileSectionPrimaryButton: "text-white bg-[#4285F4]/20 hover:bg-[#4285F4] border border-[#4285F4]/40 px-3 py-1.5 rounded-xl font-semibold transition-all text-xs shadow-sm",
            
            badge: "bg-[#4285F4] !text-white font-bold px-2.5 py-0.5 rounded-full text-[10px] tracking-wide",
            
            breadcrumbs: "text-neutral-300 text-xs",
            breadcrumbsItem: "text-white font-medium",
            breadcrumbsItemDivider: "text-neutral-500",
            
            modalBackdrop: "bg-black/80 backdrop-blur-md",
            modalContent: "bg-[#0B0F24] border border-white/10 text-white rounded-3xl shadow-2xl",
          },
        }}
      >
        <UserProfile.Page label="Rendelések" url="orders" labelIcon={<ShoppingBagIcon />}>
          <OrdersTab orders={orders} />
        </UserProfile.Page>
      </UserProfile>
    </div>
  );
}