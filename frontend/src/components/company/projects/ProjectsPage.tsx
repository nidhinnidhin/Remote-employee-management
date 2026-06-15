"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Briefcase,
  Activity,
  CheckCircle2,
  Clock,
  RefreshCcw,
} from "lucide-react";
import AdminLayoutWrapper from "../layout/AdminLayoutWrapper";
import ProjectsTable from "./ProjectsTable";
import ProjectsHeader from "./ProjectsHeader";
import CreateProjectModal from "./modals/CreateProjectModal";
import EditProjectModal from "./modals/EditProjectModal";
import DeleteProjectConfirmation from "./modals/DeleteProjectConfirmation";
import { Project } from "@/shared/types/company/projects/project.type";
import {
  searchProjectsAction,
  deleteProjectAction,
} from "@/actions/company/projects/project.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/debounce/useDebounce";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const itemsPerPage = 10;

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const result = await searchProjectsAction({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
      });

      if (result.success && result.data) {
        setProjects(result.data.data || []);
        setTotalProjects(result.data.total || 0);
      } else {
        setProjects([]);
        setTotalProjects(0);
        toast.error(result.error || PROJECT_MESSAGES.PROJECT_FETCH_FAILED);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;
    const result = await deleteProjectAction(
      selectedProject._id || selectedProject.id || "",
    );
    if (result.success) {
      toast.success(PROJECT_MESSAGES.PROJECT_DELETED);
      fetchProjects();
    } else {
      toast.error(result.error || PROJECT_MESSAGES.PROJECT_DELETE_FAILED);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <AdminLayoutWrapper>
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* ── HEADER HERO SECTION ── */}
        <ProjectsHeader
          onAdd={() => setIsCreateModalOpen(true)}
          onSearch={setSearchQuery}
        />

        {/* ── BENTO STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Scope",
              value: totalProjects,
              icon: Activity,
              color: "text-blue-400",
            },
            {
              label: "Active Nodes",
              value: (projects || []).filter((p) => p.status === "Active")
                .length,
              icon: Clock,
              color: "text-accent",
            },
            {
              label: "Completed",
              value: (projects || []).filter((p) => p.status === "Completed")
                .length,
              icon: CheckCircle2,
              color: "text-emerald-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.06] flex items-center gap-4"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center shrink-0",
                  stat.color,
                )}
              >
                <stat.icon size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
                  {stat.label}
                </p>
                <p className="text-lg font-black text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── DATA TABLE ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Live Registry
              </span>
            </div>
            <button
              onClick={fetchProjects}
              className="text-slate-600 hover:text-accent transition-colors"
            >
              <RefreshCcw size={14} className={cn(loading && "animate-spin")} />
            </button>
          </div>

          <div className="portal-card overflow-hidden border border-white/[0.06] bg-white/[0.01]">
            <ProjectsTable
              projects={projects}
              isLoading={loading}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              totalItems={totalProjects}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchProjects}
      />
      {selectedProject && (
        <>
          <EditProjectModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProject(null);
            }}
            onSuccess={fetchProjects}
            project={selectedProject}
          />
          <DeleteProjectConfirmation
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedProject(null);
            }}
            onConfirm={handleDeleteConfirm}
            projectName={selectedProject?.name || ""}
          />
        </>
      )}
    </AdminLayoutWrapper>
  );
};

export default ProjectsPage;
