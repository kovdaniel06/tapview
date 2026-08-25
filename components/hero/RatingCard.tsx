"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function RatingCard() {
return (
<motion.div
whileHover={{ y: -5, scale: 1.02 }}
transition={{ duration: 0.25, ease: "easeOut" }}
style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
className="
relative
w-[200px]
rounded-[24px]
border border-white/20
bg-[#0B132B]/92
backdrop-blur-2xl
p-4
shadow-[0_25px_60px_-10px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.3)]
overflow-hidden
select-none
"
>
{/* Background Lighting & Subtle Glow */}
<div className="absolute inset-0 rounded-[26px] bg-gradient-to-br from-amber-500/20 via-transparent to-blue-600/10 pointer-events-none" />
<div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-500/25 blur-2xl pointer-events-none" />

{/* HEADER */}
<div className="relative z-10 flex items-center justify-between">
<div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/30">
<Star className="h-4 w-4 fill-amber-400 text-amber-400" />
</div>
<span className="rounded-full border border-amber-400/35 bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-300 shadow-sm">
★ 4.9
</span>
</div>

{/* BODY */}
<div className="relative z-10 mt-4 mb-3">
<span className="block text-[9px] font-extrabold tracking-[0.18em] uppercase text-slate-400">
Google Rating
</span>
<div className="text-[32px] font-black leading-none tracking-tight text-white mt-1.5 drop-shadow-sm">
4.9
</div>
<span className="block text-[11.5px] font-medium text-slate-300 mt-1.5 leading-snug">
1,248 Verified Reviews
</span>
</div>

{/* FOOTER */}
<div className="relative z-10 flex items-center justify-between gap-2 border-t border-white/15 pt-3 mt-1 px-1">
<div className="flex shrink-0 gap-0.5">
{Array.from({ length: 5 }).map((_, i) => (
<Star key={i} className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
))}
</div>
<span className="shrink-0 text-[8px] font-bold tracking-[0.08em] uppercase text-slate-400">
LIVE
</span>
</div>
</motion.div>
);
} 
