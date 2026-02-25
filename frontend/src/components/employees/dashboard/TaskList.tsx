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
        <div className="portal-card p-6">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-base font-bold text-primary tracking-tight">My Tasks</h3>
                <button className="text-xs font-bold text-accent hover:opacity-80 transition-opacity uppercase tracking-widest">
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
                        className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg transition-colors"
                        style={{
                            borderRadius: "var(--radius-lg)",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgb(var(--color-bg-subtle))";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.backgroundColor = "";
                        }}
                    >
                        <div className="flex-1 space-y-2">
                            <h4
                                className="text-sm font-bold text-primary transition-colors"
                                style={{ color: "rgb(var(--color-text-primary))" }}
                            >
                                {task.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-4">
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                                    task.status === "in-progress"
                                        ? "status-warning"
                                        : task.status === "done"
                                            ? "status-success"
                                            : "portal-badge"
                                )}>
                                    {task.status}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted font-medium">
                                    <Calendar size={12} />
                                    {task.date}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted font-medium">
                                    <MessageSquareText size={12} />
                                    {task.comments}
                                </div>
                            </div>
                        </div>

                        <span className={cn(
                            "self-start md:self-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest",
                            task.priority === "High" ? "status-danger" : "portal-badge"
                        )}>
                            {task.priority}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
