"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { requireRole } from "@/lib/auth/unified-auth";
import { fetchMyTasksAction } from "@/actions/company/projects/task.actions";
import { getAllProjectsAction } from "@/actions/company/projects/project.actions";
import { getStoriesByProjectAction } from "@/actions/company/projects/story.actions";
import { Task, TaskStatus, MyTasksResponse } from "@/shared/types/company/projects/task.type";
import { Project } from "@/shared/types/company/projects/project.type";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import EmployeeKanbanBoard from "@/components/employees/tasks/EmployeeKanbanBoard";
import EmployeeStoryCard from "@/components/employees/stories/EmployeeStoryCard";
import ProjectStatusBadge from "@/components/company/projects/ProjectStatusBadge";
import { Loader2, AlertCircle, LayoutDashboard, ChevronRight, Goal, GitPullRequest } from "lucide-react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import Link from "next/link";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";
import { cn } from "@/lib/utils";

export default function EmployeeProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [activeTab, setActiveTab] = useState<"board" | "stories">("board");
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [stories, setStories] = useState<UserStory[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tasksResult, projectsResult, storiesResult] = await Promise.all([
        fetchMyTasksAction(),
        getAllProjectsAction(),
        getStoriesByProjectAction(projectId),
      ]);

      if (tasksResult.success && tasksResult.data) {
         // Filter overall tasks down to just this project
         const allTasks = (tasksResult.data as MyTasksResponse).tasks ?? (tasksResult.data as any);
         setTasks(allTasks.filter((t: Task) => t.projectId === projectId));
      } else {
         setError(tasksResult.error || "Failed to load tasks");
      }

      if (projectsResult.success && projectsResult.data) {
         const foundProject = projectsResult.data.find((p: Project) => (p.id || p._id) === projectId);
         if (foundProject) setProject(foundProject);
         else setError("Project not found or you don't have access.");
      }

      if (storiesResult.success && storiesResult.data) {
         setStories(storiesResult.data);
      }

    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  // Derive stories that belong to tasks assigned to this user
  const relevantStories = useMemo(() => {
     const assignedStoryIds = new Set(tasks.map(t => t.storyId));
     return stories.filter(s => assignedStoryIds.has(s.id));
  }, [tasks, stories]);


  if (isLoading) {
    return (
      <DashboardLayout>
         <div className="flex flex-col items-center justify-center py-40 gap-4 h-[calc(100vh-8rem)]">
           <Loader2 size={40} className="animate-spin text-accent" />
           <p className="text-sm font-bold text-muted/60 uppercase tracking-widest">Loading project workspace...</p>
         </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
       <DashboardLayout>
         <div className="flex flex-col items-center justify-center py-40 gap-4 text-center h-[calc(100vh-8rem)]">
           <div className="w-20 h-20 rounded-3xl bg-danger/10 flex items-center justify-center text-danger mb-2">
             <AlertCircle size={40} />
           </div>
           <h3 className="text-xl font-bold">Failed to load project</h3>
           <p className="text-sm font-medium text-muted/80">{error || "Project not found"}</p>
           <Link href={FRONTEND_ROUTES.EMPLOYEE.PROJECTS} className="px-6 py-2 mt-4 bg-surface-raised rounded-xl text-sm font-bold hover:bg-accent/10 hover:text-accent transition-colors border border-border-subtle/20">
              Return to Portfolio
           </Link>
         </div>
       </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* Header Area */}
          <div className="flex flex-col gap-6 mb-8 shrink-0">
             {/* Breadcrumbs & Title */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted/60">
                   <Link href={FRONTEND_ROUTES.EMPLOYEE.PROJECTS} className="hover:text-accent transition-colors">Portfolio</Link>
                   <ChevronRight size={12} className="opacity-50" />
                   <span className="text-accent">Project Details</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                   <div className="flex items-center gap-4">
                      <h1 className="text-3xl font-black text-primary tracking-tight font-heading">{project.name}</h1>
                      <ProjectStatusBadge status={project.status} />
                   </div>
                </div>
                {project.description && (
                   <p className="text-sm text-muted/80 max-w-3xl leading-relaxed">
                      {project.description}
                   </p>
                )}
             </div>

             {/* Custom Tabs */}
             <div className="flex items-center gap-2 p-1.5 bg-surface/30 rounded-2xl w-fit border border-border-subtle/10">
                <button
                    onClick={() => setActiveTab("board")}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all",
                        activeTab === "board" 
                            ? "bg-[rgb(var(--color-surface-raised))] text-primary shadow-sm ring-1 ring-accent/20" 
                            : "text-muted hover:text-primary hover:bg-surface-raised/50"
                    )}
                >
                    <LayoutDashboard size={16} className={activeTab === "board" ? "text-accent" : ""} />
                    Kanban Board
                </button>
                <button
                    onClick={() => setActiveTab("stories")}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all",
                        activeTab === "stories" 
                            ? "bg-[rgb(var(--color-surface-raised))] text-primary shadow-sm ring-1 ring-accent/20" 
                            : "text-muted hover:text-primary hover:bg-surface-raised/50"
                    )}
                >
                    <Goal size={16} className={activeTab === "stories" ? "text-accent" : ""} />
                    My Objectives <span className={cn("px-1.5 py-0.5 rounded-md text-[10px]", activeTab === "stories" ? "bg-accent/10 text-accent" : "bg-surface-raised text-muted/60")}>{relevantStories.length}</span>
                </button>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 relative">
             {activeTab === "board" ? (
                 tasks.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[rgba(var(--color-border-subtle),0.1)] rounded-[3xl] bg-surface/10">
                      <div className="w-16 h-16 rounded-2xl bg-accent-subtle/20 flex items-center justify-center text-accent/30 mb-6">
                         <LayoutDashboard size={32} />
                      </div>
                      <h2 className="text-xl font-bold text-primary mb-2">No Active Tasks</h2>
                      <p className="text-sm text-muted max-w-sm leading-relaxed mb-6">
                        You have no assigned tasks in this project yet. They will appear on this board automatically once assigned.
                      </p>
                    </div>
                 ) : (
                    <EmployeeKanbanBoard 
                        tasks={tasks} 
                        projects={[project]} 
                        onRefresh={loadData} 
                    />
                 )
             ) : (
                 <div className="h-full overflow-y-auto custom-scrollbar pr-4 space-y-4 pb-12">
                     {relevantStories.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-20 px-8 text-center border border-dashed border-[rgba(var(--color-border-subtle),0.1)] rounded-[2xl] bg-surface/10">
                            <GitPullRequest size={32} className="text-accent/30 mb-4" />
                            <p className="text-sm font-medium text-muted">No specific objectives are linked to your tasks yet.</p>
                         </div>
                     ) : (
                         relevantStories.map(story => (
                             <EmployeeStoryCard 
                                 key={story.id} 
                                 story={story} 
                                 tasks={tasks.filter(t => t.storyId === story.id)}
                                 onRefresh={loadData}
                             />
                         ))
                     )}
                 </div>
             )}
          </div>
        </div>
    </DashboardLayout>
  );
}
