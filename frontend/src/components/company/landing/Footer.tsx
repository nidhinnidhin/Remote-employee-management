"use client";

import Link from "next/link";
import { Users } from "lucide-react";

const footerLinks = {
    Product: ["Features", "Pricing", "Enterprise"],
    Company: ["About", "Blog", "Careers"],
    Legal: ["Privacy", "Terms", "Security"]
};

export default function Footer() {
    return (
        <footer className="bg-neutral-950 pt-20 pb-10 border-t border-neutral-900">
            <div className="max-w-7xl mx-auto px-6">
                {/* Top Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">TeamFlow</span>
                        </Link>
                        <p className="text-neutral-400 text-sm max-w-xs">
                            Smart employee management for modern organizations.
                        </p>
                    </div>

                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-white font-bold mb-4">{title}</h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link}>
                                        <Link
                                            href="#"
                                            className="text-sm text-neutral-400 hover:text-red-500 transition-colors"
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
                <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-neutral-500">
                        © 2024 TeamFlow. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
