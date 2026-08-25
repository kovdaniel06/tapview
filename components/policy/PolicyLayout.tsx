"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface PolicySection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  sections: PolicySection[];
}

export default function PolicyLayout({
  title,
  lastUpdated,
  sections,
}: PolicyLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-neutral-300">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#4285F4]/10 blur-[220px]" />
      </div>

      {/* Faint grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="container relative mx-auto px-6 py-24">
        <div className="mx-auto max-w-5xl">
          {/* Back link */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            Back to home
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 border-b border-white/10 pb-8"
          >
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-neutral-300 backdrop-blur-md">
              Legal
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-neutral-500">
              Last updated: {lastUpdated}
            </p>
          </motion.div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[220px_1fr]">
            {/* Table of contents */}
            <motion.nav
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden lg:block"
            >
              <div className="sticky top-24">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  On this page
                </p>
                <ul className="mt-4 space-y-2 border-l border-white/10">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block border-l-2 border-transparent py-1 pl-4 text-sm text-neutral-400 transition hover:border-[#4285F4]/60 hover:text-white"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.nav>

            {/* Content */}
            <div className="space-y-6">
              {sections.map((section, i) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                  className="scroll-mt-24 rounded-[22px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition hover:border-white/20"
                >
                  <h2 className="flex items-center gap-3 text-lg font-bold text-white">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4285F4]/15 text-xs font-bold text-[#7BAAF7]">
                      {i + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 pl-10 text-sm leading-relaxed text-neutral-400">
                    {section.content}
                  </div>
                </motion.section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}