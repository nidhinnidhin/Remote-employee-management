"use client";

import Link from "next/link";
import { Users } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Enterprise"],
  Company: ["About", "Blog", "Careers"],
  Legal: ["Privacy", "Terms", "Security"],
};

export default function Footer() {
  return (
    <footer className="bg-surface pt-20 pb-10 relative">
      <div className="absolute top-0 left-0 right-0 premium-divider opacity-50" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg shadow-accent/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">WorkPilot</span>
            </Link>
            <p className="text-secondary text-sm max-w-xs">
              Smart employee management for modern organizations.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-primary font-bold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-secondary hover:text-accent transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="relative pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="absolute top-0 left-0 right-0 premium-divider opacity-30" />
          <p className="text-xs text-muted">
            © 2026 WorkPilot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
