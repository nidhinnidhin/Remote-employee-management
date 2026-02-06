"use client";

import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Stats from "./Stats";
import TargetAudience from "./TargetAudience";
import CTA from "./CTA";
import Footer from "./Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral-950 font-sans selection:bg-red-500/30 selection:text-red-200">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <TargetAudience />
      <CTA />
      <Footer />
    </div>
  );
}