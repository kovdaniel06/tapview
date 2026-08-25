"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import CheckoutModal from "../CheckoutModal";
const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "4,990",
    priceNumber: 4990,
    unit: "Ft",
    description: "Perfect for trying it out with a single location.",
    features: [
      "1× NFC Review Stand",
      "NFC + QR code combined",
      "Linked to your Google Business profile",
      "2-minute setup",
      "1-2 day delivery in Hungary",
    ],
    highlighted: false,
    ctaText: "Get Starter Pack",
  },
  {
    id: "business",
    name: "Business",
    price: "12,990",
    priceNumber: 12990,
    unit: "Ft",
    description: "The most popular choice for busy locations.",
    features: [
      "3× NFC Review Stand",
      "NFC + QR code combined",
      "Linked to your Google Business profile",
      "2-minute setup",
      "1-2 day delivery in Hungary",
      "Priority customer support",
    ],
    highlighted: true,
    ctaText: "Claim Business Pack",
  },
  {
    id: "premium",
    name: "Premium",
    price: "24,990",
    priceNumber: 24990,
    unit: "Ft",
    description: "For multi-location businesses that want it all.",
    features: [
      "5× NFC Review Stand",
      "Custom branded design",
      "Linked to your Google Business profile",
      "2-minute setup",
      "1-2 day delivery in Hungary",
      "Priority customer support",
      "Dedicated onboarding call",
    ],
    highlighted: false,
    ctaText: "Get Premium Pack",
  },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlanSelect = (plan: (typeof plans)[0]) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <section id="pricing" className="relative overflow-hidden bg-[#050816] py-28">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4285F4]/15 blur-[200px]" />
      </div>

      <div className="container relative mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-[#4285F4]/30 bg-[#4285F4]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#7BAAF7] backdrop-blur-md">
            Pricing Plans
          </span>
          <h2 className="mt-6 text-4xl font-extrabold leading-tight text-white lg:text-5xl">
            Simple,{" "}
            <span className="bg-gradient-to-r from-[#4285F4] via-[#60A5FA] to-[#7BAAF7] bg-clip-text text-transparent">
              Honest Pricing
            </span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-400">
            One-time payment, no subscriptions. Pick the pack that fits your
            business.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="mt-20 grid gap-8 md:grid-cols-3 md:items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative flex flex-col justify-between rounded-[28px] transition-all duration-300 ${
                plan.highlighted ? "md:-translate-y-3" : "hover:-translate-y-2"
              }`}
            >
              {/* Most Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#4285F4] to-[#2563EB] px-4 py-1.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(66,133,244,0.6)] uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Card Outer Border & Glow Container */}
              <div
                className={`h-full w-full rounded-[28px] p-8 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between ${
                  plan.highlighted
                    ? "border-2 border-[#4285F4] bg-[#4285F4]/[0.08] shadow-[0_20px_60px_-15px_rgba(66,133,244,0.35)] hover:shadow-[0_25px_80px_-10px_rgba(66,133,244,0.5)]"
                    : "border border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_15px_40px_-15px_rgba(255,255,255,0.1)]"
                }`}
              >
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-[#7BAAF7] transition-colors">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-5xl font-extrabold tracking-tight text-white">
                      {plan.price}
                    </span>
                    <span className="text-lg font-semibold text-neutral-400">
                      {plan.unit}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    one-time payment • no hidden fees
                  </p>

                  <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${
                            plan.highlighted
                              ? "bg-[#4285F4]/30 border border-[#4285F4]"
                              : "bg-white/10 border border-white/20"
                          }`}
                        >
                          <Check className="h-3 w-3 text-[#7BAAF7]" />
                        </div>
                        <span className="text-sm font-medium text-neutral-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Modál Nyitása Gomb */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`group/btn relative mt-8 flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full py-4 font-semibold text-sm transition-all duration-300 active:scale-95 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-[#4285F4] to-[#2563EB] text-white shadow-[0_10px_25px_-5px_rgba(66,133,244,0.5)] hover:shadow-[0_15px_35px_rgba(66,133,244,0.8)] hover:brightness-110"
                      : "border border-white/15 bg-white/5 text-white backdrop-blur-md hover:border-white/30 hover:bg-white/15 hover:shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
                  }`}
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover/btn:translate-x-full" />
                  
                  <span className="relative z-10 flex items-center gap-2">
                    {plan.ctaText}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Checkout Modál megjelenítése */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </section>
  );
}