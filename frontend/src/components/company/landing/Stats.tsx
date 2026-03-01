"use client";

import { motion } from "framer-motion";

const stats = [
    { value: "50k+", label: "Employees Managed" },
    { value: "2,500+", label: "Companies" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "99.9%", label: "Uptime SLA" }
];

export default function Stats() {
    return (
        <section className="py-20 relative">
            <div className="absolute top-0 left-0 right-0 premium-divider opacity-50" />
            <div className="absolute bottom-0 left-0 right-0 premium-divider opacity-50" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <h3 className="text-4xl md:text-5xl font-bold mb-2 text-accent">
                                {stat.value}
                            </h3>
                            <p className="text-sm font-medium text-muted uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
