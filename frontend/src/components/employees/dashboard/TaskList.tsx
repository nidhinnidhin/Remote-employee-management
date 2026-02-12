"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";

const tasks = [
    {
        id: 1,
        title: "Implement user authentication API",
        status: "in-progress",
        priority: "High",
        date: "2024-01-20",
        comments: 3,
    },
    {
        id: 2,
        title: "Fix memory leak in WebSocket server",
        status: "todo",
        priority: "High",
        date: "2024-01-18",
        comments: 5,
    },
    {
        id: 3,
        title: "Update API documentation",
        status: "todo",
        priority: "Medium",
        date: "2024-01-15",
        comments: 1,
    },
    {
        id: 4,
        title: "Code review for payment module",
        status: "in-progress",
        priority: "Medium",
        date: "2024-01-19",
        comments: 8,
    },
    {
        id: 5,
        title: "Database migration for new schema",
        status: "done",
        priority: "High",
        date: "2024-01-15",
        comments: 12,
    },
];

export function TaskList() {
    return (
        <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-base font-bold text-neutral-900 tracking-tight">My Tasks</h3>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest">
                    View all
                </button>
            </div>

            <div className="space-y-3">
                {tasks.map((task, index) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100"
                    >
                        <div className="flex-1 space-y-2">
                            <h4 className="text-sm font-bold text-neutral-800 group-hover:text-indigo-600 transition-colors">
                                {task.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-4">
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                                    task.status === "in-progress" ? "bg-amber-50 text-amber-600" :
                                        task.status === "todo" ? "bg-neutral-100 text-neutral-500" :
                                            "bg-emerald-50 text-emerald-600"
                                )}>
                                    {task.status}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
                                    <Calendar size={12} />
                                    {task.date}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
                                    <MessageSquareText size={12} />
                                    {task.comments}
                                </div>
                            </div>
                        </div>

                        <span className={cn(
                            "self-start md:self-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest",
                            task.priority === "High" ? "bg-rose-500 text-white" : "bg-indigo-500 text-white"
                        )}>
                            {task.priority}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
