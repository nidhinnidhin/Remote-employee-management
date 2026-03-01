"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-surface/50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg shadow-accent/20">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        WorkPilot
                    </span>
                </Link>

                <div className="flex items-center gap-8">
                    <Link href="/auth/login" className="btn-highlight">
                        Sign in
                    </Link>
                </div>

                {/* Bottom Divider Gradient */}
                <div className="absolute bottom-0 left-0 right-0 premium-divider opacity-50" />
            </div>
        </nav>
    );
}
