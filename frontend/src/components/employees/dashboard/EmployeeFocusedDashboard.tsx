"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ListTodo,
  Timer,
  FolderKanban,
  LayoutDashboard,
} from "lucide-react";
import { StatCards, StatItem } from "@/components/employees/dashboard/StatCards";
import { fetchMyTasksAction } from "@/actions/company/projects/task.actions";
import { getAllProjectsAction } from "@/actions/company/projects/project.actions";
import { Task, TaskStatus, MyTasksResponse } from "@/shared/types/company/projects/task.type";
import { Project } from "@/shared/types/company/projects/project.type";
import EmployeeProjectList from "@/components/employees/projects/EmployeeProjectList";
import EmployeeTaskCard from "@/components/employees/tasks/EmployeeTaskCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";

export default function EmployeeFocusedDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tasksResult, projectsResult] = await Promise.all([
        fetchMyTasksAction(),
        getAllProjectsAction(),
      ]);
      if (tasksResult.success && tasksResult.data) {
        setTasks((tasksResult.data as MyTasksResponse).tasks ?? (tasksResult.data as any));
      } else {
        setError(tasksResult.error || "Failed to load your tasks");
      }
      if (projectsResult.success && projectsResult.data) {
        setProjects(projectsResult.data);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute stats from live data
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inProgress = tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS);
  const dueToday = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  });
  const overdue = tasks.filter((t) => {
    if (!t.dueDate || t.status === TaskStatus.DONE) return false;
    return new Date(t.dueDate) < today;
  });
  const done = tasks.filter((t) => t.status === TaskStatus.DONE);
  const assignedProjectIds = new Set(tasks.map((t) => t.projectId));

  const stats: StatItem[] = [
    {
      icon: ListTodo,
      label: "My Tasks",
      value: tasks.length,
      subtext: `${done.length} completed`,
      progress: tasks.length > 0 ? Math.round((done.length / tasks.length) * 100) : 0,
      variant: "info",
    },
    {
      icon: Timer,
      label: "In Progress",
      value: inProgress.length,
      subtext: "Active right now",
      variant: "info",
    },
    {
      icon: AlertCircle,
      label: "Overdue",
      value: overdue.length,
      subtext: overdue.length > 0 ? "Needs attention" : "You're on track!",
      variant: overdue.length > 0 ? "danger" : "success",
    },
    {
      icon: FolderKanban,
      label: "My Projects",
      value: assignedProjectIds.size,
      subtext: "Active portfolio",
      variant: "info",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 size={40} className="animate-spin text-accent" />
        <p className="text-sm font-bold text-muted/60 uppercase tracking-widest">
          Loading your workspace...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-danger">
        <AlertCircle size={40} />
        <p className="text-sm font-bold">{error}</p>
        <button
          onClick={loadData}
          className="text-[11px] font-black uppercase tracking-widest text-accent hover:underline mt-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── 1. Stat Cards ── */}
      <StatCards stats={stats} />

      {/* ── 2. Due Today Strip ── */}
      {dueToday.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <h2 className="text-base font-black text-primary uppercase tracking-[0.15em]">
              Due Today
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-warning/10 text-warning border border-warning/30">
              {dueToday.length}
            </span>
            <div className="h-[1px] flex-1 bg-warning/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
            {dueToday.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <EmployeeTaskCard
                  task={task}
                  projectName={projects.find((p) => p._id === task.projectId || p.id === task.projectId)?.name}
                  onRefresh={loadData}
                  showProjectBadge
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── 3. In Progress ── */}
      {inProgress.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <h2 className="text-base font-black text-primary uppercase tracking-[0.15em]">
                In Progress
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-accent/10 text-accent border border-accent/20">
                {inProgress.length}
              </span>
              <div className="h-[1px] flex-1 bg-accent/10" />
            </div>
            <Link
              href={FRONTEND_ROUTES.EMPLOYEE.TASKS}
              className="text-[11px] font-black uppercase tracking-widest text-accent hover:text-accent/70 transition-colors flex items-center gap-1.5"
            >
              View Board →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
            {inProgress.slice(0, 6).map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <EmployeeTaskCard
                  task={task}
                  projectName={projects.find((p) => p._id === task.projectId || p.id === task.projectId)?.name}
                  onRefresh={loadData}
                  showProjectBadge
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── 4. Overdue Alert ── */}
      {overdue.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            <h2 className="text-base font-black text-danger uppercase tracking-[0.15em]">
              Overdue
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-danger/10 text-danger border border-danger/30">
              {overdue.length}
            </span>
            <div className="h-[1px] flex-1 bg-danger/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
            {overdue.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <EmployeeTaskCard
                  task={task}
                  projectName={projects.find((p) => p._id === task.projectId || p.id === task.projectId)?.name}
                  onRefresh={loadData}
                  showProjectBadge
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── 5. My Projects ── */}
      <EmployeeProjectList tasks={tasks} projects={projects} />

      {/* ── 6. Empty State ── */}
      {tasks.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-accent-subtle/20 flex items-center justify-center text-accent/30">
            <LayoutDashboard size={40} strokeWidth={1} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-primary">No assigned work yet</h2>
            <p className="text-sm text-muted max-w-sm leading-relaxed">
              When your manager assigns tasks to you, they'll appear here. Check back later!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
