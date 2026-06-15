"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Task } from "@/shared/types/company/projects/task.type";
import { Project } from "@/shared/types/company/projects/project.type";
import { LayoutGrid, AlertCircle, Info, Search, Loader2 } from "lucide-react";
import EmployeeProjectCard from "./EmployeeProjectCard";
import { searchProjectsAction } from "@/actions/company/projects/project.actions";
import Pagination from "@/components/ui/Pagination";
import ProjectCommentsModal from "./ProjectCommentsModal";
import { CommentEntityType } from "@/shared/types/company/projects/comment.type";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/debounce/useDebounce";
import Link from "next/link";

interface EmployeeProjectListProps {
  tasks: Task[];
  userId: string;
  isDashboardView?: boolean;
}

export default function EmployeeProjectList({
  tasks,
  userId,
  isDashboardView = false,
}: EmployeeProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const itemsPerPage = isDashboardView ? 2 : 6;

  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");

  const handleOpenComments = useCallback((projectId: string, projectName: string) => {
    setSelectedProjectId(projectId);
    setSelectedProjectName(projectName);
    setCommentsModalOpen(true);
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const result = await searchProjectsAction({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        memberId: userId,
      });

      if (result.success && result.data) {
        setProjects(result.data.data || []);
        setTotalProjects(result.data.total || 0);
      } else {
        toast.error(result.error || "Failed to load projects");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, debouncedSearch]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const projectStats = useMemo(() => {
    const stats: Record<string, { tasks: number; stories: number }> = {};
    tasks.forEach((task) => {
      if (!stats[task.projectId]) {
        stats[task.projectId] = { tasks: 0, stories: 0 };
      }
      stats[task.projectId].tasks += 1;
    });

    const storiesPerProject: Record<string, Set<string>> = {};
    tasks.forEach((task) => {
      if (!storiesPerProject[task.projectId]) {
        storiesPerProject[task.projectId] = new Set();
      }
      storiesPerProject[task.projectId].add(task.storyId);
    });

    Object.keys(storiesPerProject).forEach((pId) => {
      if (stats[pId]) {
        stats[pId].stories = storiesPerProject[pId].size;
      }
    });

    return stats;
  }, [tasks]);

  if (!loading && projects.length === 0 && !searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center  border-dashed border-[rgba(var(--color-border-subtle),0.1)] rounded-[3rem] bg-surface/20 animate-in zoom-in-95 duration-700">
        <h2 className="text-xl font-bold text-primary tracking-tight mb-2">
          No Active Projects
        </h2>
        <p className="text-[13px] text-muted max-w-sm leading-relaxed mb-8">
          You are not currently assigned to any active projects. Once tasks are
          assigned to you, they will appear here automatically.
        </p>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10 text-accent/60">
          <AlertCircle size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Awaiting Assignment
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-info animate-pulse" />
          <h2 className="text-base font-black text-primary uppercase tracking-[0.15em]">
            My Projects
          </h2>
          {isDashboardView && totalProjects > 2 && (
            <Link
              href="/employee/projects"
              className="ml-auto sm:ml-4 text-[11px] font-black uppercase tracking-widest text-accent hover:text-accent/70 transition-colors shrink-0"
            >
              View More →
            </Link>
          )}
        </div>

        {!isDashboardView && (
          <div className="relative w-full sm:w-72 md:w-80 group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-accent transition-colors duration-200">
              <Search size={14} />
            </div>
            <input
              type="text"
              placeholder="Search your projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/[0.06] focus:border-accent/30 rounded-xl text-[13px] text-white placeholder:text-white/30 focus:outline-none transition-all duration-300"
            />
            {loading && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                <Loader2 size={14} className="animate-spin text-accent" />
              </div>
            )}
          </div>
        )}
      </div>

      {loading && projects.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 opacity-50 pointer-events-none">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 rounded-3xl bg-white/[0.02] border border-white/[0.06] animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/[0.06]">
          <p className="text-muted text-sm">
            No projects match your search query.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 text-accent text-xs font-bold uppercase tracking-widest hover:underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project) => {
              const stats = projectStats[project.id || project._id] || {
                tasks: 0,
                stories: 0,
              };
              return (
                  <EmployeeProjectCard
                    key={project.id || project._id}
                    project={project}
                    taskCount={stats.tasks}
                    storyCount={stats.stories}
                    onOpenComments={handleOpenComments}
                  />
              );
            })}
          </div>

          {!isDashboardView && totalProjects > itemsPerPage && (
            <div className="pt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalProjects / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {commentsModalOpen && (
        <ProjectCommentsModal
          isOpen={commentsModalOpen}
          onClose={() => setCommentsModalOpen(false)}
          entityId={selectedProjectId}
          entityType={CommentEntityType.PROJECT}
          title={`Comments - ${selectedProjectName}`}
        />
      )}
    </div>
  );
}
