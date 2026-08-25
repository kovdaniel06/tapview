"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import GrowthCard from "./GrowthCard";
import RatingCard from "./RatingCard";

export default function HeroVisual() {
return (
<div className="relative flex h-[860px] w-full items-start justify-center overflow-visible">
{/* Ambient Radial Background Glow */}
<div className="absolute h-[800px] w-[800px] rounded-full bg-blue-600/18 blur-[170px]" />

{/* Fix szélességű "stage" — telefon + kártyák */}
<div className="relative h-[860px] w-[700px] max-w-full">

{/* Top Left Growth Card */}
<motion.div
animate={{ y: [-8, 8, -8] }}
transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
className="absolute left-[20px] top-[-12px] z-40"
>
<GrowthCard />
</motion.div>

{/* Center Phone */}
<motion.div
animate={{ y: [-6, 6, -6] }}
transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
className="absolute left-1/2 top-[300px] z-20 h-[880px] w-[540px] -translate-x-1/2 -translate-y-1/2"
>
<Image
src="/images/hero/phone-hero.png"
alt="Phone"
fill
priority
sizes="500px"
className="object-contain drop-shadow-[0_45px_75px_rgba(0,0,0,0.7)]"
/>
</motion.div>

{/* Bottom Right Rating Card */}
<motion.div
animate={{ y: [8, -8, 8] }}
transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
className="absolute right-[0px] top-[400px] z-40"
>
<RatingCard />
</motion.div>

{/* NFC Stand Image */}
<motion.div
animate={{ y: [-4, 4, -4] }}
transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
className="absolute right-[430px] top-[300px] z-30"
>
<Image
src="/images/hero/stand.png"
alt="NFC Review Stand"
width={260}
height={260}
priority
className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
/>
</motion.div>
</div>
</div>
);
}