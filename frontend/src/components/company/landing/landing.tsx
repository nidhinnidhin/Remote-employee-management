"use client";

import { useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Stats from "./Stats";
import TargetAudience from "./TargetAudience";
import Footer from "./Footer";

export default function Landing() {
  useEffect(() => {
    document.documentElement.classList.add("theme-employee");
    return () => {
      document.documentElement.classList.remove("theme-employee");
    };
  }, []);

  return (
    <div className="theme-employee portal-page font-sans selection:bg-accent/30 selection:text-accent-muted overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <TargetAudience />
      <Footer />
    </div>
  );
}