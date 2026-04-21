"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fetchMyTasksAction } from "@/actions/company/projects/task.actions";
import { getAllProjectsAction } from "@/actions/company/projects/project.actions";
import {
  Task,
  MyTasksResponse,
} from "@/shared/types/company/projects/task.type";
import { Project } from "@/shared/types/company/projects/project.type";
import EmployeeKanbanBoard from "@/components/employees/tasks/EmployeeKanbanBoard";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import { cn } from "@/lib/utils";

export default function EmployeeTasksPage() {
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
        setTasks(
          (tasksResult.data as MyTasksResponse).tasks ??
            (tasksResult.data as any),
        );
      } else {
        setError(tasksResult.error || "Failed to load tasks");
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

  return (
    <DashboardLayout>
      <div className="flex flex-col w-full min-h-screen animate-in fade-in duration-700">
        {/* SaaS Header */}
        <div className="flex items-center justify-between mb-8 border-b border-white/[0.06] pb-6 shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
              Project Board
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>{tasks.length} Total Tasks</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span>{projects.length} Active Projects</span>
            </div>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <RefreshCcw size={14} className={cn(isLoading && "animate-spin")} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Sync Board
            </span>
          </button>
        </div>

        <div className="flex-1">
          {!isLoading && !error && tasks.length > 0 && (
            <EmployeeKanbanBoard
              tasks={tasks}
              projects={projects}
              onRefresh={loadData}
            />
          )}

          {isLoading && (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2
                className="animate-spin text-accent mb-4"
                size={32}
                strokeWidth={1.5}
              />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                Assembling Workspace...
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
