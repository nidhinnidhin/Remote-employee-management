"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-neutral-950/50 border-b border-neutral-800">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                        WorkPilot
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/company/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                        Sign in
                    </Link>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/company/register"
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-red-600/20 transition-all"
                        >
                            Get Started
                        </Link>
                    </motion.div>
                </div>
            </div>
        </nav>
    );
}
