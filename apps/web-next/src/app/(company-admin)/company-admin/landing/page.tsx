import React from "react";
import {
    Navbar,
    HeroSection,
    StatsSection,
    FeaturesGrid,
    WhyChooseSection,
    CTASection,
    Footer
} from "@/components/company-admin/landing";

export default function CompanyLandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-violet-100 selection:text-violet-900">
            <Navbar />
            <main className="pt-24 pb-16">
                <HeroSection />
                <StatsSection />
                <FeaturesGrid />
                <WhyChooseSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
}
