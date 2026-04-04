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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  const projectUrl = `${FRONTEND_ROUTES.EMPLOYEE.PROJECTS}/${project.id || project._id}`;

  return (
    <Link 
      href={projectUrl}
      className={cn(
        "group block p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden",
        "flex flex-col gap-5 h-full"
      )}
    >
      {/* Top Row: Icon and Status */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent ring-1 ring-accent/20">
          <FolderKanban size={18} strokeWidth={1.5} />
        </div>
        <ProjectStatusBadge status={project.status} className="scale-90 origin-right" />
      </div>

      {/* Content: Title and Description */}
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-accent transition-colors">
          {project.name}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">
          {project.description || "No project description provided."}
        </p>
      </div>

      {/* Timeline Section: Thinner, lighter borders */}
      <div className="py-3 border-y border-white/[0.05]">
        <div className="flex items-center gap-2 text-slate-500">
           <Calendar size={13} strokeWidth={1.5} />
           <span className="text-[10px] font-black tracking-[0.15em] pt-0.5">
             {formatDate(project.startDate)} — {formatDate(project.endDate)}
           </span>
        </div>
      </div>

      {/* Footer: Stats & Link */}
      <div className="mt-auto flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-accent" strokeWidth={2} />
              <span className="text-[11px] font-bold text-slate-200">{taskCount} tasks</span>
           </div>
           <div className="flex items-center gap-1.5">
              <Layers size={13} className="text-slate-600" strokeWidth={2} />
              <span className="text-[11px] font-bold text-slate-500">{storyCount} stories</span>
           </div>
        </div>
        
        {/* Simple Arrow: Smaller and more discreet */}
        <div className="text-slate-500 group-hover:text-accent group-hover:translate-x-1 transition-all">
           <ArrowRight size={16} strokeWidth={2} />
        </div>
      </div>
    </Link>
  );
}