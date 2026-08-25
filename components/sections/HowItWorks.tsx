"use client";

import { motion } from "framer-motion";
import { Smartphone, Star, MessageSquareHeart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Smartphone,
    title: "Guest Taps the Stand",
    description:
      "A happy customer simply taps their phone on the NFC Review Stand — no app, no typing, no hassle.",
  },
  {
    number: "02",
    icon: Star,
    title: "Google Reviews Opens Instantly",
    description:
      "Their phone opens your Google Business page directly to the review screen, ready to write.",
  },
  {
    number: "03",
    icon: MessageSquareHeart,
    title: "They Leave a 5-Star Review",
    description:
      "In under 30 seconds, a new verified review is live — building trust and boosting your ranking.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden bg-[#050816] py-16 md:py-28">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4285F4]/10 blur-[160px] md:h-[800px] md:w-[800px] md:blur-[220px]" />
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
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white md:mt-6 md:text-4xl lg:text-5xl">
            Three Steps to{" "}
            <span className="bg-gradient-to-r from-[#4285F4] to-[#7BAAF7] bg-clip-text text-transparent">
              More Reviews
            </span>
          </h2>
          <p className="mt-3 text-base leading-7 text-neutral-400 md:mt-5 md:text-lg md:leading-8">
            No app downloads. No friction. Just one tap between your customer
            and a five-star review.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-12 grid gap-5 md:mt-20 md:grid-cols-3 md:gap-6">

          {/* Connecting line (desktop only) */}
          <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="
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
                {/* Step number badge */}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4285F4]/15 border border-[#4285F4]/30 md:h-14 md:w-14 md:rounded-2xl">
                  <Icon className="h-5 w-5 text-[#7BAAF7] md:h-6 md:w-6" />
                </div>

                <span className="mt-5 block text-xs font-bold tracking-[0.2em] text-[#4285F4] md:mt-6 md:text-sm">
                  STEP {step.number}
                </span>

                <h3 className="mt-2 text-lg font-bold text-white md:mt-3 md:text-xl">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-400 md:mt-3 md:text-[15px] md:leading-7">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}