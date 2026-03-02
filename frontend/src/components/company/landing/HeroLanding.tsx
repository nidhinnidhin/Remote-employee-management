"use client";

import { motion } from "framer-motion";
import BackgroundEffect from "@/components/ui/BackgroundEffect";
import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            <BackgroundEffect />
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
                        Smart Employee
                        <br />
                        <span className="text-red-500">Management Platform</span>
                    </h1>

                    <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Streamline HR operations, track performance, manage attendance, and
                        empower your workforce. The complete solution for modern employee
                        management.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href={FRONTEND_ROUTES.AUTH.REGISTER}
                                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-xl shadow-red-600/20 flex items-center gap-2 group transition-all"
                            >
                                Register
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <button className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl border border-neutral-800 flex items-center gap-2 transition-all">
                                <PlayCircle className="w-5 h-5 text-red-500" />
                                Watch Demo
                            </button>
                        </motion.div>
                    </div>

                    <p className="mt-6 text-sm text-neutral-500">
                        No credit card required • 14-day free trial • Cancel anytime
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
