"use client";

import { motion } from "framer-motion";
import BackgroundEffect from "@/components/ui/BackgroundEffect";
import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";

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
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-tight">
            Smart Employee
            <br />
            <span className="text-accent">Management Platform</span>
          </h1>

          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
            Streamline HR operations, track performance, manage attendance, and
            empower your workforce. The complete solution for modern employee
            management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/login"
                className="btn-highlight px-10 py-4"
              >
                Sign in
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="px-8 py-4 bg-surface-raised/50 hover:bg-surface-raised text-primary font-semibold rounded-xl border border-border/50 hover:border-accent/40 backdrop-blur-sm flex items-center gap-2 transition-all">
                <PlayCircle className="w-5 h-5 text-accent" />
                Watch Demo
              </button>
            </motion.div>
          </div>

          <p className="mt-6 text-sm text-muted">
            Enterprise grade security • Real-time tracking • Seamless collaboration
          </p>
        </motion.div>
      </div>
    </section>
  );
}
