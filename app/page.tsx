import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Trusted from "@/components/sections/Trusted";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="bg-[#0A0A0A] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Trusted />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}