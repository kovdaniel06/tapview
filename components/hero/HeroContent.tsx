"use client";

import { motion } from "framer-motion";

export default function HeroContent() {
return (
<div className="relative z-10 max-w-2xl">

<motion.div
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-300 backdrop-blur-md"
>
⭐ Trusted by Local Businesses
</motion.div>

<motion.h1
initial={{ opacity: 0, y: 25 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.15, duration: 0.6 }}
className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl"
>
Get More
<br />
<span className="bg-gradient-to-r from-[#4285F4] to-[#7BAAF7] bg-clip-text text-transparent">
Google Reviews
</span>
<br />
With One Tap.
</motion.h1>

<motion.p
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 0.3 }}
className="mt-8 max-w-lg text-lg leading-8 text-neutral-400"
>
Help happy customers leave Google Reviews instantly with a premium
NFC Review Stand. One tap is all it takes to grow trust and attract
more customers.
</motion.p>

<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 0.45 }}
className="mt-10 flex flex-wrap gap-4"
>
<button className="rounded-full bg-[#4285F4] px-7 py-4 font-semibold text-white transition hover:bg-[#357AE8]">
Get Started
</button>

<button className="rounded-full border border-white/10 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10">
Watch Demo
</button>
</motion.div>

</div>
);
}