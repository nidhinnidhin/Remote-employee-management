"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Info,
  Layout,
  ListTodo,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayoutWrapper from "@/components/company/layout/AdminLayoutWrapper";
import Button from "@/components/ui/Button";
import ProjectStatusBadge from "@/components/company/projects/ProjectStatusBadge";
import { Project } from "@/shared/types/company/projects/project.type";
import { getProjectByIdAction } from "@/actions/company/projects/project.actions";
import { toast } from "sonner";
import BacklogView from "@/components/admin/stories/BacklogView";
import BoardView from "@/components/admin/tasks/BoardView";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Backlog" | "Board">("Backlog");

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      setLoading(true);
      const result = await getProjectByIdAction(id as string);
      if (result.success && result.data) {
        setProject(result.data);
      } else {
        toast.error(result.error || "Failed to load project details");
      }
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <AdminLayoutWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" />
        </div>
      </AdminLayoutWrapper>
    );
  }

  if (!project) {
    return (
      <AdminLayoutWrapper>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-primary">Project not found</h2>
          <Link
            href="/admin/projects"
            className="text-accent hover:underline mt-4 inline-block"
          >
            Back to Projects
          </Link>
        </div>
      </AdminLayoutWrapper>
    );
  }

  return (
    <AdminLayoutWrapper>
      <div className="flex flex-col gap-6">
        {/* Back and Title section */}
        <div className="flex flex-col gap-6 mb-6">
          {/* --- BREADCRUMB --- */}
          <Link
            href="/admin/projects"
            className="group flex items-center gap-2.5 w-fit transition-colors"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] group-hover:border-accent/40 transition-all">
              <ArrowLeft
                size={12}
                className="text-slate-500 group-hover:text-accent"
              />
            </div>
            <span className="font-black uppercase tracking-[0.2em] text-[9px] text-slate-500 group-hover:text-slate-300">
              Back to Projects
            </span>
          </Link>

          {/* --- TITLE & STATUS --- */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none">
                {project.name}
              </h1>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <ProjectStatusBadge status={project.status} />
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="relative group overflow-hidden portal-card p-8 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] rounded-[1rem]">
          {/* Ambient background glow for depth */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                  <Info size={16} className="text-accent" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Project Intelligence Brief
                </h3>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed antialiased font-medium max-w-3xl">
                {project.description ||
                  "No tactical objectives defined for this active project node."}
              </p>
            </div>

            {/* --- RIGHT: METADATA GRID (30% width) --- */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-6 lg:pl-10 lg:border-l border-white/[0.06]">
              {/* Start Date */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-accent" />
                  Commencement
                </span>
                <div className="flex items-center gap-3 text-white font-bold tracking-tight">
                  <Calendar size={14} className="text-accent/60" />
                  <span className="text-sm">
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )
                      : "TBD"}
                  </span>
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-orange-500" />
                  Final Deadline
                </span>
                <div className="flex items-center gap-3 text-white font-bold tracking-tight">
                  <Calendar size={14} className="text-orange-400/60" />
                  <span className="text-sm">
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
          {/* --- TAB NAVIGATION: SEGMENTED CONTROL --- */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl w-fit">
            {[
              { id: "Backlog", icon: ListTodo, label: "Backlog" },
              { id: "Board", icon: Layout, label: "Kanban Board" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "relative flex items-center gap-2.5 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group",
                  activeTab === tab.id
                    ? "text-[#08090a]"
                    : "text-slate-500 hover:text-slate-200",
                )}
              >
                {/* The Sliding Background Pill */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-accent rounded-md shadow-[0_0_15px_rgba(var(--color-accent),0.3)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Content - Must be relative z-10 to sit above the pill */}
                <tab.icon
                  size={14}
                  strokeWidth={activeTab === tab.id ? 3 : 2}
                  className="relative z-10 transition-transform duration-300 group-active:scale-90"
                />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* --- TAB CONTENT: FLUID CONTAINER --- */}
          <div className="relative min-h-[500px] w-full bg-white/[0.01] border border-white/[0.03] rounded-[2rem] p-1 overflow-hidden">
            {/* Subtle inner glow for the workspace area */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] to-transparent pointer-events-none" />

            <div className="relative z-10">
              {activeTab === "Backlog" ? (
                <BacklogView projectId={id as string} />
              ) : (
                <BoardView projectId={id as string} />
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
};

export default ProjectDetailsPage;
