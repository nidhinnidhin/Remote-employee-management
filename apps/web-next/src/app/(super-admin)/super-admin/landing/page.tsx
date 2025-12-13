"use client";
import HeroSection from "@/components/super-admin/landing/HeroSection";
import StatsBar from "@/components/super-admin/landing/StatsBar";
import FeaturesGrid from "@/components/super-admin/landing/FeaturesGrid";
import CapabilitiesGrid from "@/components/super-admin/landing/CapabilitiesGrid";
import SecuritySection from "@/components/super-admin/landing/SecuritySection";
import CTASection from "@/components/super-admin/landing/CTASection";
import Navbar from "@/components/super-admin/landing/Navbar";
import Footer from "@/components/super-admin/landing/Footer";

export default function SuperAdminMarketingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-rose-100 selection:text-rose-600">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturesGrid />
      <CapabilitiesGrid />
      <SecuritySection />
      <CTASection />
      <Footer />
    </div>
  );
}
