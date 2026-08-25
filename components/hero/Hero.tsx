"use client";

import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";

export default function Hero() {
return (
<section className="relative overflow-hidden bg-[#050816] pt-32 pb-16">

{/* Background glow */}
<div className="absolute inset-0">
<div className="absolute left-1/2 top-16 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-[#4285F4]/20 blur-[240px]" />
</div>

<div className="container relative mx-auto px-6">

<div className="grid items-start gap-16 lg:grid-cols-[0.95fr_1.25fr]">

<HeroContent />

<div className="flex justify-center lg:justify-end lg:pr-2">
<HeroVisual />
</div>

</div>

</div>

</section>
);
}