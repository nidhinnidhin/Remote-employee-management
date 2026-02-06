"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Stats from "./components/Stats";
import TargetAudience from "./components/TargetAudience";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

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