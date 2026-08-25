"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do customers need to download an app?",
    answer:
      "No. Tapping the stand or scanning the QR code opens your Google review page directly in their phone's browser — nothing to install.",
  },
  {
    question: "Does it work with every phone?",
    answer:
      "Yes. Most modern iPhones and Android phones support NFC tapping. For older phones or anyone who prefers it, the QR code on the stand works as a reliable backup.",
  },
  {
    question: "How long does setup take?",
    answer:
      "About 2 minutes. You link the stand to your Google Business profile once, place it on your counter or table, and it's ready to collect reviews immediately.",
  },
  {
    question: "Is this a subscription?",
    answer:
      "No. It's a one-time payment for the physical stand. There are no monthly fees or hidden charges.",
  },
  {
    question: "Can the reviews be fake or manipulated?",
    answer:
      "No. Every review goes through Google's own official review flow, so it's fully authentic and verified — the stand simply removes friction, it doesn't change how Google reviews work.",
  },
  {
    question: "How fast is delivery in Hungary?",
    answer:
      "Once you order, delivery typically takes 1-2 business days anywhere in Hungary.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-[#050816] py-16 md:py-28">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute right-1/2 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#4285F4]/10 blur-[160px] md:right-1/3 md:h-[700px] md:w-[700px] md:translate-x-0 md:blur-[220px]" />
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
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white md:mt-6 md:text-4xl lg:text-5xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#4285F4] to-[#7BAAF7] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mt-3 text-base leading-7 text-neutral-400 md:mt-5 md:text-lg md:leading-8">
            Everything you need to know before getting started.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="mx-auto mt-10 max-w-3xl space-y-3 md:mt-16 md:space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative"
              >
                <div
                  className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition hover:border-white/20 md:rounded-[22px]"
                  style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left md:gap-4 md:px-6 md:py-5"
                  >
                    <span className="text-sm font-semibold text-white md:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#7BAAF7] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm leading-6 text-neutral-400 md:px-6 md:pb-5 md:text-[15px] md:leading-7">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}