"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useTransition,
} from "react";
import { useParams } from "next/navigation";
import { fetchMyTasksAction } from "@/actions/company/projects/task.actions";
import { getAllProjectsAction } from "@/actions/company/projects/project.actions";
import { getStoriesByProjectAction } from "@/actions/company/projects/story.actions";
import { getSprintsByProjectAction } from "@/actions/company/projects/sprint.actions";
import { Sprint } from "@/shared/types/company/projects/sprint.type";
import {
  Task,
  MyTasksResponse,
} from "@/shared/types/company/projects/task.type";
import { Project } from "@/shared/types/company/projects/project.type";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import EmployeeKanbanBoard from "@/components/employees/tasks/EmployeeKanbanBoard";
import EmployeeStoryCard from "@/components/employees/stories/EmployeeStoryCard";
import ProjectStatusBadge from "@/components/company/projects/ProjectStatusBadge";
import {
  Loader2,
  ChevronRight,
  Timer,
  LayoutDashboard,
  Goal,
  GitPullRequest,
} from "lucide-react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import Link from "next/link";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";
import { cn } from "@/lib/utils";

export default function EmployeeProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"board" | "stories">("board");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setIsLoading(true);

      try {
        const [tasksResult, projectsResult, storiesResult, sprintsResult] = await Promise.all([
          fetchMyTasksAction(),
          getAllProjectsAction(),
          getStoriesByProjectAction(projectId),
          getSprintsByProjectAction(projectId),
        ]);

        startTransition(() => {
          if (projectsResult.success && projectsResult.data) {
            const found = projectsResult.data.find(
              (p: any) => p.id === projectId || p._id === projectId,
            );
            if (found) setProject(found);
          }

          // 1. Find Active Sprint
          const active = sprintsResult.success && sprintsResult.data 
            ? (sprintsResult.data as Sprint[]).find(s => s.status === 'ACTIVE') 
            : null;
          setActiveSprint(active || null);

          if (!active) {
            setTasks([]);
            setStories([]);
            return;
          }

          // 2. Filter Stories for Active Sprint
          const activeStories = storiesResult.success && storiesResult.data
            ? (storiesResult.data as UserStory[]).filter(s => {
                const sId = (s.id || (s as any)._id)?.toString();
                return active.issueIds.some(id => id.toString() === sId);
              })
            : [];
          setStories(activeStories);

          // 3. Filter Tasks for Active Sprint
          if (tasksResult.success && tasksResult.data) {
            const allTasks =
              (tasksResult.data as MyTasksResponse).tasks ||
              (tasksResult.data as any) ||
              [];
            
            const projectTasks = allTasks.filter(
                (t: any) => t.projectId === projectId || t.project === projectId
            );

            // Only tasks that belong to stories in the active sprint
            setTasks(
              projectTasks.filter((t: any) => {
                const tStoryId = t.storyId?.toString();
                return activeStories.some(s => (s.id || (s as any)._id)?.toString() === tStoryId);
              })
            );
          }
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [projectId],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const relevantStories = useMemo(() => {
    const assignedStoryIds = new Set(tasks.map((t) => t.storyId?.toString()));
    return stories.filter((s: any) =>
      assignedStoryIds.has(s.id?.toString() || s._id?.toString()),
    );
  }, [tasks, stories]);

  // Show spinner ONLY on initial load
  // Show spinner ONLY on initial load
  if (isLoading && !project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40 gap-4 h-[calc(100vh-8rem)]">
          <Loader2 size={40} className="animate-spin text-accent" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            Loading Workspace...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (project && !activeSprint) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40 gap-8 h-[calc(100vh-8rem)] animate-in fade-in duration-700">
           <div className="w-24 h-24 rounded-[3rem] bg-orange-500/5 flex items-center justify-center text-orange-500/20 border border-orange-500/10 mb-2 border-dashed">
             <Timer size={48} className="translate-y-0.5" />
           </div>
           <div className="text-center space-y-3">
              <h3 className="text-2xl font-black text-white tracking-tight">No Active Sprint</h3>
              <p className="text-slate-500 text-sm max-w-[320px] leading-relaxed font-medium mx-auto">
                There are currently no active sprints for this project. Please wait for your project manager to start the next cycle.
              </p>
           </div>
           <Link
             href={FRONTEND_ROUTES.EMPLOYEE.PROJECTS}
             className="px-10 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all"
           >
              Back to Portfolio
           </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        className={cn(
          "flex flex-col transition-opacity duration-300",
          isPending ? "opacity-70" : "opacity-100",
        )}
      >
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8 shrink-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <Link
                href={FRONTEND_ROUTES.EMPLOYEE.PROJECTS}
                className="hover:text-accent"
              >
                Portfolio
              </Link>
              <ChevronRight size={10} />
              <span className="text-accent">Project Details</span>
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black text-white tracking-tighter">
                {project?.name}
              </h1>
              <ProjectStatusBadge status={project?.status as any} />
              {isPending && (
                <Loader2 size={16} className="animate-spin text-accent" />
              )}
            </div>
          </div>

          {/* Tab Toggle */}
          <div className="flex items-center p-1.5 bg-white/[0.02] border border-white/10 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("board")}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                activeTab === "board"
                  ? "bg-white/5 text-white border border-white/10"
                  : "text-slate-500",
              )}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setActiveTab("stories")}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                activeTab === "stories"
                  ? "bg-white/5 text-white border border-white/10"
                  : "text-slate-500",
              )}
            >
              Objectives ({relevantStories.length})
              <span className="ml-2 text-accent/50 text-[9px] font-bold">
                {relevantStories.reduce((sum, s) => sum + (s.storyPoints || 0), 0)} pts
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          {activeTab === "board" ? (
            <EmployeeKanbanBoard
              tasks={tasks}
              projects={project ? [project] : []}
              onRefresh={() => loadData(true)}
            />
          ) : (
            <div className="h-full overflow-y-auto space-y-4 pb-12 custom-scrollbar">
              <div className="space-y-4">
                {relevantStories.map((story) => (
                <EmployeeStoryCard
                  key={story.id || (story as any)._id}
                  story={story}
                  tasks={tasks.filter(
                    (t) => t.storyId?.toString() === (story.id?.toString() || (story as any)._id?.toString()),
                  )}
                  onRefresh={() => loadData(true)}
                />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
