"use client";

import { motion } from "framer-motion";
import {
  Scissors,
  UtensilsCrossed,
  Coffee,
  Dumbbell,
  Sparkles,
  Car,
  Stethoscope,
  Cake,
} from "lucide-react";

const categories = [
  { icon: Scissors, label: "Hair Salons" },
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: Coffee, label: "Cafés" },
  { icon: Dumbbell, label: "Gyms" },
  { icon: Sparkles, label: "Beauty Studios" },
  { icon: Car, label: "Car Washes" },
  { icon: Stethoscope, label: "Dental Clinics" },
  { icon: Cake, label: "Bakeries" },
];

const loopItems = [...categories, ...categories];

export default function Trusted() {
  return (
    <section className="relative overflow-hidden bg-[#050816] py-12 md:py-16">
      <div className="container relative mx-auto px-4 md:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 md:text-sm">
          Built for Local Businesses Like Yours
        </p> 
      </div>

      {/* Fade edges */}
      <div className="relative mt-8 overflow-hidden md:mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#050816] to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#050816] to-transparent md:w-32" />

        <motion.div
          className="flex w-max gap-3 md:gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {loopItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="
                  flex shrink-0 items-center gap-2.5
                  rounded-full border border-white/10 bg-white/[0.03]
                  px-4 py-2.5
                  backdrop-blur-md
                  md:gap-3 md:px-6 md:py-3
                "
              >
                <Icon className="h-4 w-4 text-[#7BAAF7]" />
                <span className="whitespace-nowrap text-xs font-medium text-neutral-300 md:text-sm">
                  {item.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}