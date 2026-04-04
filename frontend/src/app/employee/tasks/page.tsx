"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { requireRole } from "@/lib/auth/unified-auth";
import { fetchMyTasksAction } from "@/actions/company/projects/task.actions";
import { getAllProjectsAction } from "@/actions/company/projects/project.actions";
import { Task, MyTasksResponse } from "@/shared/types/company/projects/task.type";
import { Project } from "@/shared/types/company/projects/project.type";
import EmployeeKanbanBoard from "@/components/employees/tasks/EmployeeKanbanBoard";
import { Loader2, AlertCircle, LayoutDashboard } from "lucide-react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";


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
        setTasks((tasksResult.data as MyTasksResponse).tasks ?? (tasksResult.data as any));
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
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <div className="mb-6 flex items-center gap-3 shrink-0">
             <h2 className="text-2xl font-black text-primary tracking-tight font-heading uppercase">My Assigned Tasks</h2>
             <div className="h-[1px] flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
          </div>

          <div className="flex-1 relative">
            {isLoading ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/50 backdrop-blur-sm z-10 rounded-3xl">
                 <Loader2 size={40} className="animate-spin text-accent mb-4" />
                 <p className="text-sm font-bold text-muted/60 uppercase tracking-widest">Loading task board...</p>
               </div>
            ) : error ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center p-12 rounded-3xl border border-red-500/10 bg-red-500/5 text-center">
                 <AlertCircle size={40} className="text-red-500 mb-4" />
                 <h3 className="text-xl font-bold mb-2">Failed to Load Tasks</h3>
                 <p className="text-muted/80 max-w-sm mb-6">{error}</p>
                 <button 
                   onClick={loadData}
                   className="px-6 py-2.5 bg-accent text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20"
                 >
                   Retry Connection
                 </button>
               </div>
            ) : tasks.length === 0 ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[rgba(var(--color-border-subtle),0.1)] rounded-[3xl] bg-surface/20">
                 <div className="w-20 h-20 rounded-3xl bg-accent-subtle/20 flex items-center justify-center text-accent/30 mb-6">
                    <LayoutDashboard size={40} strokeWidth={1} />
                 </div>
                 <h2 className="text-xl font-black text-primary mb-2">No active tasks</h2>
                 <p className="text-sm text-muted max-w-sm leading-relaxed mb-8">
                   You currently have no tasks assigned to you. Once managers create and assign tasks, they will appear here.
                 </p>
               </div>
            ) : (
                <EmployeeKanbanBoard 
                    tasks={tasks} 
                    projects={projects} 
                    onRefresh={loadData} 
                />
            )}
          </div>
        </div>
    </DashboardLayout>
  );
}
