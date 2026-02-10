"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export function GreetingHeader() {
    const [time, setTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const formattedDate = time.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl p-8 bg-white border border-neutral-100 shadow-sm"
        >
            {/* Subtle background gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 blur-3xl -mr-20 -mt-20 rounded-full" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2 tracking-tight">
                        Hello, John 👋
                    </h1>
                    <p className="text-neutral-500 text-sm mt-1">
                        Senior Backend Developer
                    </p>
                </div>

                <div className="flex items-center gap-3 text-neutral-500 text-xs font-semibold bg-neutral-50 px-4 py-2 rounded-lg border border-neutral-100">
                    <Clock size={14} className="text-indigo-500" />
                    <span className="tabular-nums">{formattedTime}</span>
                    <span className="w-px h-3 bg-neutral-200" />
                    <span>{formattedDate}</span>
                </div>
            </div>
        </motion.div>
    );
}
