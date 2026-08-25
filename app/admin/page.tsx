"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export type AdminOrder = {
  id: string;
  orderNumber?: number | string;
  stripeSessionId?: string;
  userId?: string | null; // Supabase Authenticated User ID
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  businessName?: string;
  googleMapsUrl?: string;
  
  // Szállítás
  shippingMethod: string;
  shippingPostalCode?: string;
  shippingCity?: string;
  shippingAddress: string;
  pickupPointName?: string;
  pickupPointAddress?: string;

  // Számlázás
  billingName?: string;
  billingTaxNumber?: string;
  billingPostalCode?: string;
  billingCity?: string;
  billingAddress?: string;

  // Billingo mezők
  invoiceUrl?: string;
  invoiceId?: string | number;

  productName: string;
  quantity: number;
  totalAmount: number;
  status: "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
};

const StatusBadge = ({
  status,
  onChange,
  disabled,
}: {
  status: AdminOrder["status"];
  onChange?: (newStatus: AdminOrder["status"]) => void;
  disabled?: boolean;
}) => {
  const styles: Record<AdminOrder["status"], string> = {
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    PROCESSING: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    SHIPPED: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    DELIVERED: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    CANCELLED: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  };

  return (
    <select
      value={status}
      disabled={disabled}
      onChange={(e) => onChange && onChange(e.target.value as AdminOrder["status"])}
      className={`text-xs px-3 py-1 rounded-full font-semibold border cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 disabled:opacity-50 ${styles[status] || styles.PROCESSING}`}
    >
      <option value="PAID">Fizetve</option>
      <option value="PROCESSING">Feldolgozás alatt</option>
      <option value="SHIPPED">Futárnak átadva (Úton)</option>
      <option value="DELIVERED">Kiszállítva</option>
      <option value="CANCELLED">Törölve</option>
    </select>
  );
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [invoicingId, setInvoicingId] = useState<string | null>(null);
  const [downloadingLabelId, setDownloadingLabelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  
  // Ügyfél profil kiválasztása részletes előzmény-megtekintéshez
  const [selectedUserProfileId, setSelectedUserProfileId] = useState<string | null>(null);

  // Email küldés modal state-ek
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Hiba a letöltéskor");

      const formattedOrders: AdminOrder[] = (data || []).map((item: any) => {
        const meta = item.metadata || item.raw_data?.metadata || {};
        const raw = item.raw_data || {};

        const firstItemName = Array.isArray(item.items) && item.items.length > 0 
          ? item.items[0].name 
          : (item.product_name || meta.planName || "NFC Google Review Stand");
        
        const firstItemQty = Array.isArray(item.items) && item.items.length > 0 
          ? item.items[0].quantity 
          : (item.quantity || 1);

        const customFieldBusiness = raw.custom_fields?.find(
          (f: any) => f.key === 'business_name' || f.label?.toLowerCase().includes('vállalkozás') || f.label?.toLowerCase().includes('cég')
        );
        const extractedBusiness = customFieldBusiness?.text?.value || customFieldBusiness?.value || customFieldBusiness?.numeric?.value;

        const finalBusinessName = 
          item.business_name || 
          item.company_name ||
          meta.businessName || 
          meta.business_name ||
          meta.companyName ||
          extractedBusiness || 
          "";

        const pickupName = item.pickup_point_name || item.pickupPointName || meta.pickupPointName || raw.pickup_point_name || "";
        const pickupAddr = item.pickup_point_address || item.pickupPointAddress || meta.pickupPointAddress || raw.pickup_point_address || "";
        
        const rawMethod = String(item.shipping_method || meta.shippingMethod || meta.shipping_method || "").toLowerCase();

        const isPickup = 
          Boolean(pickupName) || 
          rawMethod.includes("pickup") || 
          rawMethod.includes("foxpost") || 
          rawMethod.includes("automata") || 
          rawMethod.includes("csomagpont") || 
          rawMethod.includes("point");

        // Szállítási címelemek kinyerése
        const shippingZip = item.shipping_postal_code || meta.shippingPostalCode || meta.shipping_postal_code || raw.shipping_details?.address?.postal_code || "";
        const shippingCity = item.shipping_city || meta.shippingCity || meta.shipping_city || raw.shipping_details?.address?.city || "";
        const shippingStreet = item.shipping_address || meta.shippingAddress || meta.shipping_address || raw.shipping_details?.address?.line1 || "";

        const stripeAddress = raw.shipping_details?.address 
          ? `${shippingZip} ${shippingCity}, ${shippingStreet}`.trim()
          : "";

        const finalShippingAddress = 
          shippingStreet || 
          meta.shippingAddress || 
          stripeAddress || 
          (isPickup ? "Átvételi pontra kérve" : "Nincs megadott cím");

        // Számlázási címelemek kinyerése
        const billingZip = item.billing_postal_code || meta.billingPostalCode || meta.billing_postal_code || "";
        const billingCity = item.billing_city || meta.billingCity || meta.billing_city || "";
        const billingStreet = item.billing_address || meta.billingAddress || meta.billing_address || "";

        const stripeId = item.stripe_session_id || item.id;

        const invoiceUrl =
          item.invoice_url ||
          item.invoiceUrl ||
          meta.invoice_url ||
          meta.invoiceUrl ||
          meta.billingo_invoice_url ||
          "";

        // Felhasználó azonosító felderítése
        const userId = item.user_id || meta.userId || meta.user_id || raw.client_reference_id || null;

        return {
          id: item.id,
          orderNumber: item.order_number ?? item.orderNumber,
          stripeSessionId: stripeId,
          userId: userId,
          customerName: item.customer_name || meta.customerName || raw.customer_details?.name || "Vásárló",
          customerEmail: item.customer_email || meta.customerEmail || raw.customer_details?.email || item.email || "Nincs e-mail",
          customerPhone: item.customer_phone || meta.customerPhone || raw.customer_details?.phone || "Nincs megadva",
          
          businessName: finalBusinessName,
          googleMapsUrl: item.google_maps_url || meta.googleMapsUrl || meta.google_maps_url || "",

          shippingMethod: isPickup ? "Csomagautomata / Átvételi pont" : "GLS Házhozszállítás",
          shippingPostalCode: shippingZip,
          shippingCity: shippingCity,
          shippingAddress: finalShippingAddress,
          
          pickupPointName: pickupName,
          pickupPointAddress: pickupAddr,

          billingName: item.billing_name || meta.billingName || raw.customer_details?.name || "",
          billingTaxNumber: item.billing_tax_number || meta.billingTaxNumber || meta.billing_tax_number || "",
          billingPostalCode: billingZip,
          billingCity: billingCity,
          billingAddress: billingStreet,

          invoiceUrl: invoiceUrl,
          invoiceId: item.invoice_id || meta.invoice_id || "",

          productName: firstItemName,
          quantity: firstItemQty,
          totalAmount: item.total_amount ?? item.totalAmount ?? (item.amount_total ? item.amount_total / 100 : 0),
          status: String(item.status || "PROCESSING").toUpperCase() as AdminOrder["status"],
          createdAt: item.created_at ? new Date(item.created_at).toLocaleString("hu-HU") : "Mostanság",
          items: item.items || [],
        };
      });

      setOrders(formattedOrders);
    } catch (err) {
      console.error("Váratlan hiba:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: AdminOrder["status"]) => {
    setUpdatingId(id);

    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
    );

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        alert("Hiba történt a státusz mentésekor!");
        fetchOrders();
      }
    } catch (err) {
      console.error("Hiba:", err);
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateInvoice = async (orderId: string) => {
    setInvoicingId(orderId);
    try {
      const res = await fetch("/api/admin/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Hiba a számla kiállításakor: " + data.error);
        return;
      }

      alert("Számla sikeresen kiállítva!");
      
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, invoiceUrl: data.invoiceUrl, invoiceId: data.invoiceId } : o
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, invoiceUrl: data.invoiceUrl, invoiceId: data.invoiceId } : null
        );
      }
    } catch (err) {
      console.error("Hiba a számlázás során:", err);
      alert("Hálózati hiba történt a számlázás során.");
    } finally {
      setInvoicingId(null);
    }
  };

  const handleDownloadLabel = async (orderId: string) => {
    setDownloadingLabelId(orderId);
    try {
      const res = await fetch("/api/admin/shipping-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(`Csomagcímke generálási hiba: ${errData.error || res.statusText}`);
        return;
      }

      const blob = await res.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
    } catch (err) {
      console.error("Csomagcímke letöltési hiba:", err);
      alert("Nem sikerült lekérni a csomagcímkét.");
    } finally {
      setDownloadingLabelId(null);
    }
  };

  // Email küldés modal megnyitása — alapértelmezett tárggyal
  const openEmailModal = () => {
    if (!selectedOrder) return;
    const displayNum = selectedOrder.orderNumber ? `#ORD-${selectedOrder.orderNumber}` : `#${selectedOrder.id.slice(0, 8)}`;
    setEmailSubject(`Frissítés a ${displayNum} rendelésedről`);
    setEmailMessage("");
    setEmailFeedback(null);
    setEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!selectedOrder || !emailSubject.trim() || !emailMessage.trim()) {
      setEmailFeedback({ type: "error", text: "A tárgy és az üzenet megadása kötelező." });
      return;
    }

    setSendingEmail(true);
    setEmailFeedback(null);

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedOrder.customerEmail,
          customerName: selectedOrder.customerName,
          orderNumber: selectedOrder.orderNumber,
          subject: emailSubject,
          message: emailMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ismeretlen hiba történt.");
      }

      setEmailFeedback({ type: "success", text: `E-mail sikeresen elküldve ide: ${selectedOrder.customerEmail}` });
      setEmailMessage("");
    } catch (err: any) {
      console.error("E-mail küldési hiba:", err);
      setEmailFeedback({ type: "error", text: err.message || "Nem sikerült elküldeni az e-mailt." });
    } finally {
      setSendingEmail(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.trim().toLowerCase();
    
    const rawNumStr = order.orderNumber ? String(order.orderNumber).toLowerCase() : "";
    const formattedOrdHash = `#ord-${rawNumStr}`;
    const formattedOrdPlain = `ord-${rawNumStr}`;
    const formattedOrdCompact = `ord${rawNumStr}`;

    const matchesOrderNumber =
      rawNumStr.includes(query) ||
      formattedOrdHash.includes(query) ||
      formattedOrdPlain.includes(query) ||
      formattedOrdCompact.includes(query);

    const matchesSearch =
      matchesOrderNumber ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerEmail.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      (order.userId && order.userId.toLowerCase().includes(query)) ||
      (order.businessName && order.businessName.toLowerCase().includes(query)) ||
      order.productName.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingShipments = orders.filter((o) => o.status === "PROCESSING" || o.status === "PAID").length;

  const formatFullAddress = (zip?: string, city?: string, address?: string) => {
    const parts = [zip, city, address].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "Nincs megadva";
  };

  // Kijelölt profil adatai és rendelési előzményei
  const selectedUserOrders = selectedUserProfileId 
    ? orders.filter((o) => o.userId === selectedUserProfileId || o.customerEmail === selectedUserProfileId)
    : [];

  const userProfileSummary = selectedUserProfileId && selectedUserOrders.length > 0 
    ? {
        name: selectedUserOrders[0].customerName,
        email: selectedUserOrders[0].customerEmail,
        userId: selectedUserOrders[0].userId,
        totalSpent: selectedUserOrders.reduce((sum, o) => sum + o.totalAmount, 0),
        orderCount: selectedUserOrders.length,
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* FEJLÉC */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold px-2.5 py-1 rounded-md border border-emerald-500/20">
                LIVE SUPABASE DATA
              </span>
              <span className="text-gray-500 text-sm">v3.5 • User Tracking</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1 tracking-tight">Vezérlőpult</h1>
            <p className="text-sm text-gray-400 mt-0.5">Élő rendelési és felhasználói adatok a Supabase adatbázisból.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="px-3.5 py-2 text-sm font-medium text-gray-300 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Frissítés
            </button>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Főoldal
            </Link>
          </div>
        </div>

        {/* STATISZTIKAI KÁRTYÁK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Összes rendelés</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white tracking-tight">{loading ? "..." : `${orders.length} db`}</span>
            </div>
          </div>

          <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Összes bevétel</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-emerald-400 tracking-tight">
                {loading ? "..." : `${totalRevenue.toLocaleString("hu-HU")} Ft`}
              </span>
            </div>
          </div>

          <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Kiküldésre vár</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-amber-400 tracking-tight">{loading ? "..." : `${pendingShipments} db`}</span>
            </div>
          </div>
        </div>

        {/* RENDELÉSEK TÁBLÁZAT */}
        <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl backdrop-blur-sm shadow-xl overflow-hidden">
          <div className="p-5 border-b border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Rendelések
              <span className="text-xs bg-gray-800 text-gray-400 font-mono px-2 py-0.5 rounded-full">
                {filteredOrders.length} db
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Keresés (Rendelésszám, Név, Cég)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2 pl-9 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition"
                />
                <svg className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto bg-gray-950 border border-gray-800 text-gray-300 text-sm rounded-xl px-3.5 py-2 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Összes státusz</option>
                <option value="PAID">Fizetve</option>
                <option value="PROCESSING">Feldolgozás alatt</option>
                <option value="SHIPPED">Futárnak átadva (Úton)</option>
                <option value="DELIVERED">Kiszállítva</option>
                <option value="CANCELLED">Törölve</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800/60 bg-gray-950/40 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Rendelésszám</th>
                  <th className="py-3.5 px-6">Vásárló / Profil</th>
                  <th className="py-3.5 px-6">Termék</th>
                  <th className="py-3.5 px-6">Szállítás</th>
                  <th className="py-3.5 px-6">Összeg</th>
                  <th className="py-3.5 px-6 text-center">Státusz</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-sm text-gray-300">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Rendelések betöltése...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      Nem található a keresésnek megfelelő rendelés.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const displayNum = order.orderNumber
                      ? `#ORD-${order.orderNumber}`
                      : `#${order.id.slice(0, 8)}`;

                    return (
                      <tr key={order.id} className="hover:bg-gray-800/30 transition">
                        <td className="py-4 px-6 font-mono font-bold text-emerald-400 text-xs">
                          {displayNum}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white">{order.customerName}</div>
                          {order.businessName && <div className="text-xs text-blue-400 font-medium">{order.businessName}</div>}
                          <div className="text-xs text-gray-400">{order.customerEmail}</div>
                          
                          {/* USER PROFIL BADGE */}
                          <div className="mt-1">
                            {order.userId ? (
                              <button
                                onClick={() => setSelectedUserProfileId(order.userId!)}
                                className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full hover:bg-emerald-500/20 transition cursor-pointer"
                              >
                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Bejelentkezett fiók
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedUserProfileId(order.customerEmail)}
                                className="inline-flex items-center gap-1 text-[10px] font-medium bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-full hover:bg-gray-700 transition cursor-pointer"
                              >
                                Vendég vásárló
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-200 font-medium">
                            {order.quantity}x {order.productName}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-300">{order.shippingMethod}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            {order.pickupPointName || formatFullAddress(order.shippingPostalCode, order.shippingCity, order.shippingAddress)}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-white">
                          {order.totalAmount.toLocaleString("hu-HU")} Ft
                        </td>
                        <td className="py-4 px-6 text-center">
                          <StatusBadge
                            status={order.status}
                            disabled={updatingId === order.id}
                            onChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                          />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white rounded-lg transition border border-gray-700/50 cursor-pointer"
                          >
                            Megtekintés
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETÁLIS RENDELÉS RÉSZLETEI MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-gray-800/50 cursor-pointer"
            >
              ✕
            </button>

            <div className="border-b border-gray-800 pb-3">
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {selectedOrder.orderNumber ? `#ORD-${selectedOrder.orderNumber}` : `#${selectedOrder.id}`}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Rendelés részletei</h3>
              <p className="text-xs text-gray-400 mt-0.5">Dátum: {selectedOrder.createdAt}</p>
            </div>

            {/* AKCIÓGOMBOK: STRIPE, BILLINGO SZÁMLÁZÁS, CSOMAGCÍMKE ÉS EMAIL */}
            <div className="flex flex-wrap items-center gap-2">
              {selectedOrder.stripeSessionId && (
                <a
                  href={
                    selectedOrder.stripeSessionId.startsWith("cs_")
                      ? `https://dashboard.stripe.com/test/checkout/sessions/${selectedOrder.stripeSessionId}`
                      : `https://dashboard.stripe.com/test/payments/${selectedOrder.stripeSessionId}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Stripe Dashboard
                </a>
              )}

              {/* BILLINGO SZÁMLA GOMB */}
              {selectedOrder.invoiceUrl ? (
                <a
                  href={selectedOrder.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                >
                  <span>📄</span>
                  Számla megtekintése (PDF)
                </a>
              ) : (
                <button
                  onClick={() => handleCreateInvoice(selectedOrder.id)}
                  disabled={invoicingId === selectedOrder.id}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {invoicingId === selectedOrder.id ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Számlázás...
                    </>
                  ) : (
                    <>
                      <span>⚡</span>
                      Számla (Billingo)
                    </>
                  )}
                </button>
              )}

              {/* CSOMAGCÍMKE GENERÁLÓ GOMB */}
              <button
                onClick={() => handleDownloadLabel(selectedOrder.id)}
                disabled={downloadingLabelId === selectedOrder.id}
                className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {downloadingLabelId === selectedOrder.id ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Csomagcímke...
                  </>
                ) : (
                  <>
                    <span>📦</span>
                    Csomagcímke letöltése (PDF)
                  </>
                )}
              </button>

              {/* EMAIL KÜLDÉS GOMB */}
              <button
                onClick={openEmailModal}
                className="text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>✉️</span>
                Email küldése
              </button>
            </div>

            <div className="space-y-4 text-sm">
              {/* 1. Bejelentkezett Felhasználói Profil Infó */}
              <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-0.5">
                    Fiók azonosító (User ID)
                  </span>
                  <p className="text-xs font-mono text-gray-300">
                    {selectedOrder.userId ? selectedOrder.userId : "Vendégként adta le (Nincs Fiók)"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const targetKey = selectedOrder.userId || selectedOrder.customerEmail;
                    setSelectedUserProfileId(targetKey);
                    setSelectedOrder(null);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium underline flex items-center gap-1 cursor-pointer"
                >
                  Profil megtekintése →
                </button>
              </div>

              {/* 2. Cég Adatai */}
              <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800/80">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Vállalkozás Adatai
                </span>
                <p className="text-white font-medium">
                  {selectedOrder.businessName || "Nincs megadva"}
                </p>
                {selectedOrder.googleMapsUrl && (
                  <p className="text-xs mt-1 truncate">
                    <span className="text-gray-400">Google Link: </span>
                    <a href={selectedOrder.googleMapsUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                      {selectedOrder.googleMapsUrl}
                    </a>
                  </p>
                )}
              </div>

              {/* 3. Vásárló azonosító & Kapcsolat */}
              <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800/80">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Kapcsolattartó Adatai
                </span>
                <p className="text-white font-medium">{selectedOrder.customerName}</p>
                <p className="text-blue-400 text-xs mt-0.5 font-medium">{selectedOrder.customerEmail}</p>
                <p className="text-gray-400 text-xs mt-0.5">{selectedOrder.customerPhone}</p>
              </div>

              {/* 4. Szállítási Adatok */}
              <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800/80">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Szállítási Adatok
                </span>
                <p className="text-emerald-400 font-semibold text-xs mb-1">
                  {selectedOrder.shippingMethod}
                </p>
                
                {selectedOrder.pickupPointName ? (
                  <div>
                    <p className="text-white font-bold">{selectedOrder.pickupPointName}</p>
                    <p className="text-gray-300 text-xs mt-0.5">{selectedOrder.pickupPointAddress}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-200 text-xs font-medium">
                      {formatFullAddress(selectedOrder.shippingPostalCode, selectedOrder.shippingCity, selectedOrder.shippingAddress)}
                    </p>
                  </div>
                )}
              </div>

              {/* 5. Számlázási Adatok */}
              {(selectedOrder.billingName || selectedOrder.billingAddress) && (
                <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800/80">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Számlázási Adatok
                  </span>
                  <p className="text-white font-medium">{selectedOrder.billingName || "Nincs megadva"}</p>
                  {selectedOrder.billingTaxNumber && (
                    <p className="text-xs text-gray-400">Adószám: {selectedOrder.billingTaxNumber}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatFullAddress(selectedOrder.billingPostalCode, selectedOrder.billingCity, selectedOrder.billingAddress)}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-xl transition cursor-pointer text-sm"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}

      {/* ÜGYFÉL PROFIL ÉS ÁTTEKINTŐ RENDELÉSTÖRTÉNET MODAL */}
      {selectedUserProfileId && userProfileSummary && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUserProfileId(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-gray-800/50 cursor-pointer"
            >
              ✕
            </button>

            <div className="border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-sm font-bold">
                  {userProfileSummary.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">{userProfileSummary.name}</h3>
                  <p className="text-xs text-blue-400 font-mono">{userProfileSummary.email}</p>
                </div>
              </div>
            </div>

            {/* PROFIL KÁRTYÁK / MÉTRIRÁK */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800">
                <span className="text-[10px] uppercase font-semibold text-gray-500 block">Leadott rendelések</span>
                <span className="text-lg font-bold text-white mt-1 block">{userProfileSummary.orderCount} db</span>
              </div>
              <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800">
                <span className="text-[10px] uppercase font-semibold text-gray-500 block">Összesen elköltve</span>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">
                  {userProfileSummary.totalSpent.toLocaleString("hu-HU")} Ft
                </span>
              </div>
              <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-semibold text-gray-500 block">User ID</span>
                <span className="text-xs font-mono text-gray-300 truncate mt-1 block">
                  {userProfileSummary.userId || "Vendég"}
                </span>
              </div>
            </div>

            {/* RENDELÉSEK FELSOROLÁSA */}
            <div>
              <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
                Ügyfél rendelései ({selectedUserOrders.length})
              </h4>
              <div className="space-y-2.5">
                {selectedUserOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-gray-950 p-4 rounded-xl border border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gray-700 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                          {ord.orderNumber ? `#ORD-${ord.orderNumber}` : `#${ord.id.slice(0, 8)}`}
                        </span>
                        <span className="text-xs text-gray-500">• {ord.createdAt}</span>
                      </div>
                      <p className="text-sm font-medium text-white mt-0.5">
                        {ord.quantity}x {ord.productName}
                      </p>
                      {ord.businessName && (
                        <p className="text-xs text-blue-400">{ord.businessName}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="text-sm font-bold text-white">
                        {ord.totalAmount.toLocaleString("hu-HU")} Ft
                      </span>
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setSelectedUserProfileId(null);
                        }}
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg border border-gray-700 transition cursor-pointer"
                      >
                        Megtekintés
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedUserProfileId(null)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-xl transition cursor-pointer text-sm"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}

      {/* EMAIL KÜLDÉS MODAL */}
      {emailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setEmailModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-gray-800/50 cursor-pointer"
            >
              ✕
            </button>

            <div className="border-b border-gray-800 pb-3">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Email küldése
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Címzett: {selectedOrder.customerName}
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedOrder.customerEmail}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tárgy *</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-gray-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Üzenet *</label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={6}
                  placeholder="Írd meg az üzeneted a vásárlónak..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition resize-none"
                />
              </div>
            </div>

            {emailFeedback && (
              <p
                className={`text-sm text-center py-2 rounded-xl border ${
                  emailFeedback.type === "success"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                }`}
              >
                {emailFeedback.text}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setEmailModalOpen(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-xl transition cursor-pointer text-sm"
              >
                Mégse
              </button>
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-medium py-2.5 rounded-xl transition cursor-pointer text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sendingEmail ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Küldés...
                  </>
                ) : (
                  "Elküldés"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}