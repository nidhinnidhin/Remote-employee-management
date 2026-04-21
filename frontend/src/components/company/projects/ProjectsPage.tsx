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
import CreateProjectModal from "./modals/CreateProjectModal";
import EditProjectModal from "./modals/EditProjectModal";
import DeleteProjectConfirmation from "./modals/DeleteProjectConfirmation";
import { Project } from "@/shared/types/company/projects/project.type";
import {
  getAllProjectsAction,
  deleteProjectAction,
} from "@/actions/company/projects/project.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { cn } from "@/lib/utils";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const result = await getAllProjectsAction();
      if (result.success && result.data) {
        setProjects(result.data);
      } else {
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
  }, []);

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
        <div className="portal-card p-8 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06] relative overflow-hidden transition-none">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-accent/[0.08] border border-accent/20 flex items-center justify-center text-accent shrink-0 shadow-[0_0_20px_rgba(var(--color-accent),0.1)]">
                <Briefcase size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
                  Project Portfolio
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  Centralized command for company initiatives and resource
                  tracking.
                </p>
              </div>
            </div>

            {/* --- THE STYLED BUTTON --- */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className={cn(
                "group relative flex items-center gap-2.5 px-7 py-3 rounded-xl overflow-hidden shrink-0 transition-all duration-300",
                "bg-accent text-white border border-white/20", // Force White Text
                "text-[10px] font-black uppercase tracking-[0.25em] antialiased",
                "hover:brightness-110",
                "hover:shadow-[0_0_25px_rgba(var(--color-accent),0.4),inset_0_0_10px_rgba(255,255,255,0.2)]",
                "active:scale-95 shadow-xl shadow-accent/10",
              )}
            >
              {/* Internal Shimmer Animation */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

              <Plus
                size={14}
                strokeWidth={4}
                className="relative z-10 transition-transform duration-500 group-hover:rotate-90 text-white"
              />
              <span className="relative z-10 text-white">Create Project</span>
            </button>
          </div>
        </div>

        {/* ── BENTO STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Scope",
              value: projects.length,
              icon: Activity,
              color: "text-blue-400",
            },
            {
              label: "Active Nodes",
              value: projects.filter((p) => p.status === "Active").length,
              icon: Clock,
              color: "text-accent",
            },
            {
              label: "Completed",
              value: projects.filter((p) => p.status === "Completed").length,
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
