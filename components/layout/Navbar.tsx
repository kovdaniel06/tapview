"use client";

import { useState } from "react";
import Image from "next/image";
import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, HelpCircle, Sparkles, Tag, MessageCircleQuestion, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "#how", label: "How it Works", icon: HelpCircle },
    { href: "#features", label: "Features", icon: Sparkles },
    { href: "#pricing", label: "Pricing", icon: Tag },
    { href: "#faq", label: "FAQ", icon: MessageCircleQuestion },
    { href: "#contact", label: "Contact", icon: Mail },
  ];

  // Görgetést kezelő függvény mobilra
  const handleMobileClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);

    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    // Megvárjuk, míg a menü becsukódik, utána görgetünk az elemhez
    setTimeout(() => {
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        // Fallback: frissítjük a hash-t az URL-ben, ha nincs meg az id
        window.location.hash = href;
      }
    }, 150);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Image
            src="/icon.png"
            alt="Tapview Logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl object-contain shadow-lg shadow-blue-500/30"
          />
          <div>
            <h1 className="text-lg font-bold tracking-wide text-white">
              TAP<span className="text-[#4285F4]">VIEW</span>
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400">Google Review NFC</p>
          </div>
        </div>

        {/* NAVIGÁCIÓ (desktop) */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-300 md:flex">
          <a href="#how" className="transition hover:text-white">How it Works</a>
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#pricing" className="transition hover:text-white">Pricing</a>
          <a href="#faq" className="transition hover:text-white">FAQ</a>
          <a href="#contact" className="transition hover:text-white">Contact</a>
        </nav>

        {/* AUTH AKCIÓK + MOBIL HAMBURGER */}
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-sm font-semibold text-neutral-300 transition hover:text-white">
                Sign In
              </button>
            </SignInButton>

            <a
              href="#pricing"
              className="rounded-full bg-[#4285F4] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-105 hover:bg-[#5A95F5]"
            >
              Get Started
            </a>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
              
              {/* CSAK ADMINOKNAK */}
              {isAdmin && (
                <a
                  href="/admin"
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition hover:bg-white/10 px-2.5 py-1 rounded-full"
                >
                  Admin
                </a>
              )}

              {/* CLERK PROFIL IKON */}
              <UserButton 
                userProfileMode="navigation"
                userProfileUrl="/account"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full ring-2 ring-blue-500/30"
                  }
                }}
              />
            </div>
          </Show>

          {/* HAMBURGER — kizárólag mobilon látszik */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Menü bezárása" : "Menü megnyitása"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* MOBIL LENYÍLÓ NAV PANEL */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 bg-[#050816]/95 backdrop-blur-2xl md:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-1.5 px-4 py-4">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleMobileClick(e, link.href)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3.5 text-base font-medium text-neutral-200 transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white active:scale-[0.98]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#4285F4]/15 border border-[#4285F4]/25 text-[#7BAAF7] transition group-hover:bg-[#4285F4]/25">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    {link.label}
                  </motion.a>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}