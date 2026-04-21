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
  LayoutDashboard,
  ChevronRight,
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

  // 1. Transition hook to prevent the global loading spinner
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"board" | "stories">("board");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(
    async (isSilent = false) => {
      // 2. Only set global loading on the very first mount
      if (!isSilent) setIsLoading(true);

      try {
        const [tasksResult, projectsResult, storiesResult] = await Promise.all([
          fetchMyTasksAction(),
          getAllProjectsAction(),
          getStoriesByProjectAction(projectId),
        ]);

        // 3. Wrap updates in startTransition so React keeps the old UI visible while loading
        startTransition(() => {
          if (projectsResult.success && projectsResult.data) {
            const found = projectsResult.data.find(
              (p: any) => p.id === projectId || p._id === projectId,
            );
            if (found) setProject(found);
          }

          if (tasksResult.success && tasksResult.data) {
            const allTasks =
              (tasksResult.data as MyTasksResponse).tasks ||
              (tasksResult.data as any) ||
              [];
            setTasks(
              allTasks.filter(
                (t: any) =>
                  t.projectId === projectId || t.project === projectId,
              ),
            );
          }

          if (storiesResult.success && storiesResult.data) {
            setStories(storiesResult.data);
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
              {relevantStories.map((story) => (
                <EmployeeStoryCard
                  key={story.id || (story as any)._id}
                  story={story}
                  tasks={tasks.filter(
                    (t) => t.storyId === (story.id || (story as any)._id),
                  )}
                  onRefresh={() => loadData(true)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
