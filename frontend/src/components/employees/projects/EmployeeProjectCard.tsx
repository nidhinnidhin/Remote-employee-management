"use client";

import React from "react";
import Link from "next/link";
import { FolderKanban, Calendar, ArrowRight, CheckCircle2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/shared/types/company/projects/project.type";
import ProjectStatusBadge from "@/components/company/projects/ProjectStatusBadge";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";

interface EmployeeProjectCardProps {
  project: Project;
  taskCount: number;
  storyCount: number;
}

export default function EmployeeProjectCard({
  project,
  taskCount,
  storyCount,
}: EmployeeProjectCardProps) {
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const projectUrl = `${FRONTEND_ROUTES.EMPLOYEE.PROJECTS}/${project.id || project._id}`;

  return (
    <Link 
      href={projectUrl}
      className={cn(
        "group portal-card p-6 flex flex-col gap-6",
        "bg-[rgb(var(--color-surface))]/30 border-[rgba(var(--color-border-subtle),0.1)]",
        "hover:bg-[rgb(var(--color-surface-raised))]/50 hover:border-[rgba(var(--color-accent),0.3)]",
        "transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1"
      )}
    >
      {/* Card Header: Icon & Meta */}
      <div className="flex items-start justify-between gap-4">
        <div className="w-12 h-12 rounded-2xl bg-accent-subtle/20 flex items-center justify-center text-accent shrink-0 transition-transform group-hover:scale-110">
          <FolderKanban size={24} />
        </div>
        <ProjectStatusBadge status={project.status} className="scale-90 origin-top-right" />
      </div>

      {/* Main Content: Info & Title */}
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors tracking-tight">
          {project.name}
        </h3>
        <p className="text-[13px] text-muted line-clamp-2 leading-relaxed opacity-80 min-h-[40px]">
          {project.description || "No project description provided."}
        </p>
      </div>

      {/* Timeline Section */}
      <div className="flex items-center gap-4 py-3 border-y border-[rgba(var(--color-border-subtle),0.1)]">
        <div className="flex items-center gap-2 text-muted">
           <Calendar size={14} className="text-accent/40" />
           <span className="text-[11px] font-bold uppercase tracking-widest pt-0.5">
             {formatDate(project.startDate)} — {formatDate(project.endDate)}
           </span>
        </div>
      </div>

      {/* Footer: Stats & Link */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5" title="Tasks assigned to me">
              <CheckCircle2 size={14} className="text-accent" />
              <span className="text-[11px] font-black text-primary">{taskCount} tasks</span>
           </div>
           <div className="flex items-center gap-1.5" title="Stories assigned to me">
              <Layers size={14} className="text-primary/40" />
              <span className="text-[11px] font-black text-muted">{storyCount} stories</span>
           </div>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
           <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
}
