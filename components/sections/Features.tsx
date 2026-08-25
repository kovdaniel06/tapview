"use client";

import { motion } from "framer-motion";
import {
  Nfc,
  QrCode,
  Zap,
  TrendingUp,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Nfc,
    title: "NFC + QR Combined",
    description:
      "Works with a simple tap for NFC-enabled phones, or a quick scan via QR code as backup — every guest is covered.",
  },
  {
    icon: Zap,
    title: "No App Required",
    description:
      "Nothing to download, nothing to install. The review page opens instantly in the browser your customer already has.",
  },
  {
    icon: Smartphone,
    title: "Works On Any Phone",
    description:
      "iPhone or Android, new or old — the stand is compatible with virtually every smartphone released in the last decade.",
  },
  {
    icon: TrendingUp,
    title: "Boosts Google Ranking",
    description:
      "More reviews and higher review velocity directly improve your visibility in Google Maps and local search results.",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Trustworthy",
    description:
      "Every review comes straight from Google's own review flow — fully authentic, fully verified, zero risk of fake reviews.",
  },
  {
    icon: QrCode,
    title: "Set Up In 2 Minutes",
    description:
      "Link your Google Business profile once, place the stand on your counter, and you're ready to collect reviews.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-[#050816] py-16 md:py-28">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute right-1/2 top-1/3 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-[#4285F4]/10 blur-[160px] md:right-1/4 md:h-[700px] md:w-[700px] md:translate-x-0 md:blur-[220px]" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-300 backdrop-blur-md md:text-sm">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white md:mt-6 md:text-4xl lg:text-5xl">
            Everything You Need,{" "}
            <span className="bg-gradient-to-r from-[#4285F4] to-[#7BAAF7] bg-clip-text text-transparent">
              Nothing You Don't
            </span>
          </h2>
          <p className="mt-3 text-base leading-7 text-neutral-400 md:mt-5 md:text-lg md:leading-8">
            A simple physical product, built to remove every point of friction
            between a happy customer and a five-star review.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="mt-12 grid gap-5 md:mt-20 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="
                  group
                  relative
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.03]
                  p-6
                  backdrop-blur-xl
                  transition
                  hover:border-white/20
                  hover:bg-white/[0.05]
                  md:rounded-[26px]
                  md:p-8
                "
                style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4285F4]/15 border border-[#4285F4]/30 transition group-hover:bg-[#4285F4]/25 md:h-14 md:w-14 md:rounded-2xl">
                  <Icon className="h-5 w-5 text-[#7BAAF7] md:h-6 md:w-6" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-white md:mt-6 md:text-xl">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-400 md:mt-3 md:text-[15px] md:leading-7">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}