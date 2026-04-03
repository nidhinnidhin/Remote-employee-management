"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Info, Layout, ListTodo } from "lucide-react";
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
          <Link href="/admin/projects" className="text-accent hover:underline mt-4 inline-block">
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
        <div className="flex flex-col gap-4">
          <Link href="/admin/projects" className="group flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors w-fit">
            <div className="p-1.5 rounded-lg bg-surface border border-border-subtle group-hover:border-accent group-hover:bg-accent/5 transition-all">
              <ArrowLeft size={14} />
            </div>
            <span className="font-bold uppercase tracking-widest text-[10px]">Back to Projects</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black text-primary font-heading tracking-tight">
                {project.name}
              </h1>
              <ProjectStatusBadge status={project.status} className="mt-1" />
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="portal-card p-6 md:p-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <Info size={16} />
              <h3 className="text-xs font-black uppercase tracking-[0.2em]">Project Overview</h3>
            </div>
            <p className="text-secondary text-sm leading-relaxed">
              {project.description || "No description provided for this project."}
            </p>
          </div>

          <div className="w-full md:w-64 flex flex-col gap-4 p-4 rounded-2xl bg-surface-raised/40 border border-border-subtle/30">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Start Date</span>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Calendar size={14} className="text-accent" />
                {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">End Date</span>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Calendar size={14} className="text-warning" />
                {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1 border-b border-border-subtle pb-px">
            <button
              onClick={() => setActiveTab("Backlog")}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all relative
                ${activeTab === "Backlog" ? "text-accent" : "text-muted hover:text-secondary"}
              `}
            >
              <ListTodo size={14} />
              <span>Backlog</span>
              {activeTab === "Backlog" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("Board")}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all relative
                ${activeTab === "Board" ? "text-accent" : "text-muted hover:text-secondary"}
              `}
            >
              <Layout size={14} />
              <span>Board</span>
              {activeTab === "Board" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "Backlog" ? (
              <BacklogView projectId={id as string} />
            ) : (
              <BoardView projectId={id as string} />
            )}
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
};

export default ProjectDetailsPage;
