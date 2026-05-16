"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useTransition,
} from "react";
import { useParams } from "next/navigation";
import { fetchMyTasksAction, searchTasksAction } from "@/actions/company/projects/task.actions";
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
  Search,
  Filter,
  ArrowDownWideNarrow,
  Clock,
} from "lucide-react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import Link from "next/link";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";
import { cn } from "@/lib/utils";
import Pagination from "@/components/ui/Pagination";
import { TaskStatus } from "@/shared/types/company/projects/task.type";
import { UserStoryPriority } from "@/shared/types/company/projects/user-story.type";

export default function EmployeeProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"board" | "stories">("board");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [allSprints, setAllSprints] = useState<Sprint[]>([]);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const loadData = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setIsLoading(true);

      try {
        const [projectsResult, storiesResult, sprintsResult, tasksResult] =
          await Promise.all([
            getAllProjectsAction(),
            getStoriesByProjectAction(projectId),
            getSprintsByProjectAction(projectId),
            searchTasksAction({
              projectId,
              search: searchQuery,
              status: statusFilter || undefined,
              priority: priorityFilter || undefined,
              page: currentPage,
              limit: limit,
            })
          ]);

        startTransition(() => {
          if (projectsResult.success && projectsResult.data) {
            const found = projectsResult.data.find(
              (p: any) => p.id === projectId || p._id === projectId,
            );
            if (found) setProject(found);
          }

          // 1. Find Active Sprint and store all sprints
          if (sprintsResult.success && sprintsResult.data) {
            const sprintList = sprintsResult.data as Sprint[];
            setAllSprints(sprintList);
            const active = sprintList.find((s) => s.status === "ACTIVE");
            setActiveSprint(active || null);
          }

          // 2. Set Stories
          if (storiesResult.success && storiesResult.data) {
            setStories(storiesResult.data as UserStory[]);
          }

          // 3. Set Tasks
          if (tasksResult.success && tasksResult.data) {
            setTasks(tasksResult.data.tasks || []);
            setTotalTasks(tasksResult.data.total || 0);
            setTotalPages(Math.ceil((tasksResult.data.total || 0) / limit));
          }
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [projectId, searchQuery, statusFilter, priorityFilter, currentPage],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Map storyId to its Sprint Status
  const storySprintMap = useMemo(() => {
    const map: Record<string, string> = {};
    allSprints.forEach(sprint => {
      sprint.issueIds.forEach(id => {
        map[id.toString()] = sprint.status;
      });
    });
    return map;
  }, [allSprints]);

  // Filter tasks: ONLY show tasks from the ACTIVE sprint
  const displayTasks = useMemo(() => {
    if (!activeSprint) return []; // If no active sprint, show nothing? Or show backlog?
    
    return tasks.filter(task => {
      const storyId = task.storyId?.toString();
      if (!storyId) return false;
      
      // Check if this story is in the active sprint
      return activeSprint.issueIds.some(id => id.toString() === storyId);
    });
  }, [tasks, activeSprint]);

  // Filter stories: ONLY show stories from the ACTIVE sprint
  const relevantStories = useMemo(() => {
    if (!activeSprint) return [];

    return stories.filter((s: any) => {
      const sId = s.id?.toString() || s._id?.toString();
      
      // Check if this story belongs to the active sprint
      const isInActiveSprint = activeSprint.issueIds.some(id => id.toString() === sId);
      if (!isInActiveSprint) return false;

      const matchesSearch = !searchQuery || 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !statusFilter || s.status === statusFilter;
      const matchesPriority = !priorityFilter || s.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [stories, activeSprint, searchQuery, statusFilter, priorityFilter]);

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <Link
                  href={FRONTEND_ROUTES.EMPLOYEE.PROJECTS}
                  className="hover:text-accent transition-colors"
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

            {/* Pagination at top for quick access */}
            <div className="flex items-center gap-4">
               {totalPages > 1 && (
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-1 px-3">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      className="border-none bg-transparent py-1 px-0"
                    />
                  </div>
               )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full bg-white/[0.01] border border-white/[0.06] p-4 rounded-[2rem]">
            <div className="flex flex-wrap items-center gap-3">
              {/* Tab Toggle */}
              <div className="flex items-center p-1 bg-white/[0.02] border border-white/10 rounded-2xl">
                <button
                  onClick={() => setActiveTab("board")}
                  className={cn(
                    "px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                    activeTab === "board"
                      ? "bg-white/5 text-white border border-white/10"
                      : "text-slate-500 hover:text-slate-300",
                  )}
                >
                  Kanban Board
                </button>
                <button
                  onClick={() => setActiveTab("stories")}
                  className={cn(
                    "px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                    activeTab === "stories"
                      ? "bg-white/5 text-white border border-white/10"
                      : "text-slate-500 hover:text-slate-300",
                  )}
                >
                  Objectives ({relevantStories.length})
                </button>
              </div>

              <div className="h-8 w-[1px] bg-white/10 hidden sm:block mx-1" />

              {/* Status Filter */}
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-400 focus:outline-none focus:border-accent/40 transition-all cursor-pointer hover:bg-white/5"
              >
                <option value="">All Statuses</option>
                {Object.values(TaskStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              {/* Priority Filter */}
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-400 focus:outline-none focus:border-accent/40 transition-all cursor-pointer hover:bg-white/5"
              >
                <option value="">All Priorities</option>
                {Object.values(UserStoryPriority).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full xl:w-80 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-accent transition-colors duration-200">
                <Search size={14} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks or objectives..."
                className="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/[0.06] focus:border-accent/30 rounded-2xl text-[13px] text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 shadow-inner"
              />
              {isPending && (
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <Loader2 size={14} className="animate-spin text-accent" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          {activeTab === "board" ? (
            displayTasks.length > 0 ? (
              <EmployeeKanbanBoard
                tasks={displayTasks}
                projects={project ? [project] : []}
                onRefresh={() => loadData(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white/[0.01] border border-dashed border-white/[0.06] rounded-[2rem]">
                <p className="text-slate-500 text-sm font-medium">No tasks found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setStatusFilter(""); setPriorityFilter(""); }}
                  className="mt-4 text-accent text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            )
          ) : (
            <div className="h-full overflow-y-auto space-y-4 pb-12 custom-scrollbar">
              {relevantStories.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {relevantStories.map((story) => (
                    <EmployeeStoryCard
                      key={story.id || (story as any)._id}
                      story={story}
                      tasks={displayTasks.filter(
                        (t) =>
                          t.storyId?.toString() ===
                          (story.id?.toString() ||
                            (story as any)._id?.toString()),
                      )}
                      onRefresh={() => loadData(true)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white/[0.01] border border-dashed border-white/[0.06] rounded-[2rem]">
                  <p className="text-slate-500 text-sm font-medium">No objectives found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
