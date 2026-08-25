"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Owner",
    business: "Hair Salon",
    quote:
      "Since putting the stand on the counter, we get a new Google review almost every day. It barely takes any effort from our side.",
    rating: 5,
  },
  {
    name: "Owner",
    business: "Local Café",
    quote:
      "Guests just tap their phone on their way out. Our review count nearly doubled in the first month.",
    rating: 5,
  },
  {
    name: "Owner",
    business: "Car Wash",
    quote:
      "No app, no explaining — it just works. Customers actually enjoy leaving a review now instead of forgetting.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#050816] py-16 md:py-28">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4285F4]/10 blur-[160px] md:left-1/4 md:h-[700px] md:w-[700px] md:translate-x-0 md:blur-[220px]" />
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
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white md:mt-6 md:text-4xl lg:text-5xl">
            Loved By{" "}
            <span className="bg-gradient-to-r from-[#4285F4] to-[#7BAAF7] bg-clip-text text-transparent">
              Business Owners
            </span>
          </h2>
          <p className="mt-3 text-base leading-7 text-neutral-400 md:mt-5 md:text-lg md:leading-8">
            Real results from businesses using the NFC Review Stand every day.
          </p>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="mt-12 grid gap-5 md:mt-20 md:grid-cols-3 md:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
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
              <Quote className="h-7 w-7 text-[#4285F4]/40 md:h-8 md:w-8" />

              <div className="mt-4 flex gap-1 md:mt-5">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="mt-3 text-sm leading-6 text-neutral-300 md:mt-4 md:text-[15px] md:leading-7">
                "{t.quote}"
              </p>

              <div className="mt-5 border-t border-white/10 pt-4 md:mt-6 md:pt-5">
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-neutral-500 md:text-sm">{t.business}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}