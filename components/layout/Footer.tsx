"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { sendContactForm } from "@/app/actions/contact";

const footerNavigation = {
  product: [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Contact", href: "#contact" },
    { name: "Partners", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/policy/privacy" },
    { name: "Terms of Service", href: "/policy/terms" },
    { name: "Cookie Policy", href: "/policy/cookies" },
  ],
};

const socials = [
  {
    name: "X",
    href: "#",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    name: "LinkedIn",
    href: "#",
    path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
  },
  {
    name: "GitHub",
    href: "#",
    path: "M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z",
  },
];

export default function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await sendContactForm(formData);

      if (res.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Hiba történt az elküldés során.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage("Váratlan hiba történt. Kérjük próbáld újra!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050816] text-neutral-400">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4285F4]/10 blur-[220px]" />
        <div className="absolute right-0 bottom-0 h-[300px] w-[400px] rounded-full bg-[#4285F4]/5 blur-[180px]" />
      </div>

      {/* Faint grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="container relative mx-auto px-6">
        {/* CONTACT SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="contact"
          className="grid gap-10 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-8 py-10 backdrop-blur-xl lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-14"
        >
          {/* Left: copy */}
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-neutral-300">
              Get in touch
            </span>
            <h3 className="mt-5 text-2xl font-extrabold leading-tight text-white lg:text-3xl">
              Questions? We&apos;d love to hear from you.
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              Whether it&apos;s about pricing, bulk orders, or a custom setup
              for multiple locations — send us a message and we&apos;ll get
              back to you shortly.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              {socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-neutral-400 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#4285F4]/40 hover:bg-[#4285F4]/10 hover:text-[#7BAAF7]"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs font-medium text-neutral-400"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none backdrop-blur-md transition focus:border-[#4285F4]/50 focus:bg-white/[0.05] disabled:opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-neutral-400"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none backdrop-blur-md transition focus:border-[#4285F4]/50 focus:bg-white/[0.05] disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-xs font-medium text-neutral-400"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                disabled={isSubmitting}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us a bit about what you need..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none backdrop-blur-md transition focus:border-[#4285F4]/50 focus:bg-white/[0.05] disabled:opacity-50"
              />
            </div>

            {/* Visszajelző Üzenetek */}
            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Köszönjük! Az üzeneted sikeresen elküldve. Hamarosan válaszolunk!</span>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-400"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4285F4] px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#357AE8] disabled:opacity-50 sm:w-auto cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  Küldés...
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* MAIN FOOTER CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid gap-12 py-16 lg:grid-cols-5"
        >
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4285F4] text-lg font-extrabold text-white shadow-lg shadow-blue-500/20">
                N
              </div>
              <div>
                <span className="block text-lg font-extrabold leading-tight tracking-tight text-white">
                  TAP<span className="text-[#4285F4]">VIEW</span>
                </span>
                <span className="block text-xs text-neutral-500">
                  Google Review NFC
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-400">
              Turn happy customers into 5-star Google reviews in seconds with
              instant NFC & QR technology. Built for local businesses.
            </p>

            {/* Status Badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-md transition hover:bg-emerald-500/15">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              All systems operational
            </div>
          </div>

          {/* LINKS COLUMNS */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {[
              { title: "Product", items: footerNavigation.product },
              { title: "Company", items: footerNavigation.company },
              { title: "Legal", items: footerNavigation.legal },
            ].map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-3.5 text-sm">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group relative inline-flex items-center text-neutral-400 transition hover:text-white"
                      >
                        {item.name}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#4285F4] transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} TAPVIEW. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <p className="flex items-center gap-1.5">
              Made in Hungary <span className="text-sm">🇭🇺</span>
            </p>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-neutral-400 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#4285F4]/40 hover:text-[#7BAAF7] cursor-pointer"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}