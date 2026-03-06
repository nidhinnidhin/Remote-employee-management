"use client";

import { motion } from "framer-motion";
import { Briefcase, UserCheck, Building2 } from "lucide-react";

const audiences = [
    {
        icon: <Building2 className="w-8 h-8 text-accent" />,
        title: "HR Teams",
        description: "Streamline onboarding, manage benefits, and maintain compliance with ease."
    },
    {
        icon: <UserCheck className="w-8 h-8 text-accent" />,
        title: "Managers",
        description: "Track team performance, approve requests, and foster growth."
    },
    {
        icon: <Briefcase className="w-8 h-8 text-accent" />,
        title: "Employees",
        description: "Self-service portal for time-off, documents, and personal info."
    }
];

export default function TargetAudience() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-primary mb-4"
                    >
                        Built for every team
                    </motion.h2>
                    <p className="text-secondary">
                        From startups to enterprises, TeamFlow adapts to your needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {audiences.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="portal-card p-8 text-center hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 group"
                        >
                            <div className="w-16 h-16 bg-accent-subtle rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-accent/10">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                            <p className="text-secondary leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
