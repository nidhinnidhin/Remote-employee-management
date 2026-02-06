"use client";

import { motion } from "framer-motion";
import {
    Users,
    Clock,
    TrendingUp,
    CalendarDays,
    ShieldCheck,
    Award
} from "lucide-react";

const features = [
    {
        icon: <Users className="w-6 h-6 text-red-500" />,
        title: "Employee Directory",
        description: "Centralized database for all employee information and profiles"
    },
    {
        icon: <Clock className="w-6 h-6 text-blue-500" />,
        title: "Time & Attendance",
        description: "Track work hours, overtime, and leave management effortlessly"
    },
    {
        icon: <TrendingUp className="w-6 h-6 text-yellow-500" />,
        title: "Performance Reviews",
        description: "360° feedback, goal tracking, and performance analytics"
    },
    {
        icon: <CalendarDays className="w-6 h-6 text-green-500" />,
        title: "Leave Management",
        description: "Automated leave requests, approvals, and balance tracking"
    },
    {
        icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
        title: "Enterprise Security",
        description: "SOC 2 compliant with role-based access control"
    },
    {
        icon: <Award className="w-6 h-6 text-pink-500" />,
        title: "Recognition System",
        description: "Celebrate achievements and boost employee engagement"
    }
];

export default function Features() {
    return (
        <section className="py-24 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        Everything your HR team needs
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-neutral-400"
                    >
                        Powerful features that scale with your organization
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-neutral-800/30 border border-neutral-800/50 p-6 rounded-2xl hover:bg-neutral-800/50 hover:border-neutral-700 transition-all group"
                        >
                            <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
