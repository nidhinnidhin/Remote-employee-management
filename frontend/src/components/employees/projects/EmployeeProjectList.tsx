"use client";

import React, { useMemo } from "react";
import { Task } from "@/shared/types/company/projects/task.type";
import { Project } from "@/shared/types/company/projects/project.type";
import { LayoutGrid, AlertCircle, Info } from "lucide-react";
import EmployeeProjectCard from "./EmployeeProjectCard";

interface EmployeeProjectListProps {
  tasks: Task[];
  projects: Project[];
}

export default function EmployeeProjectList({
  tasks,
  projects,
}: EmployeeProjectListProps) {
  
  // Filter projects where user has assigned work
  const filteredProjects = useMemo(() => {
    const assignedProjectIds = new Set(tasks.map(t => t.projectId));
    return projects.filter(p => assignedProjectIds.has(p.id || p._id));
  }, [tasks, projects]);

  // Derive counts per project
  const projectStats = useMemo(() => {
     const stats: Record<string, { tasks: number, stories: number }> = {};
     tasks.forEach(task => {
        if (!stats[task.projectId]) {
            stats[task.projectId] = { tasks: 0, stories: 0 };
        }
        stats[task.projectId].tasks += 1;
     });
     
     // Story counts (approximate based on unique stories in those tasks)
     const storiesPerProject: Record<string, Set<string>> = {};
     tasks.forEach(task => {
        if (!storiesPerProject[task.projectId]) {
            storiesPerProject[task.projectId] = new Set();
        }
        storiesPerProject[task.projectId].add(task.storyId);
     });
     
     Object.keys(storiesPerProject).forEach(pId => {
        if (stats[pId]) {
            stats[pId].stories = storiesPerProject[pId].size;
        }
     });

     return stats;
  }, [tasks]);

  if (filteredProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center border-2 border-dashed border-[rgba(var(--color-border-subtle),0.1)] rounded-[3rem] bg-surface/20 animate-in zoom-in-95 duration-700">
         <div className="w-16 h-16 rounded-3xl bg-accent-subtle/20 flex items-center justify-center text-accent/40 mb-6 group-hover:scale-110 transition-transform">
            <LayoutGrid size={32} strokeWidth={1} />
         </div>
         <h2 className="text-xl font-bold text-primary tracking-tight mb-2">No Active Projects</h2>
         <p className="text-[13px] text-muted max-w-sm leading-relaxed mb-8">
            You are not currently assigned to any active projects. Once tasks are assigned to you, they will appear here automatically.
         </p>
         <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10 text-accent/60">
            <AlertCircle size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Assignment</span>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col gap-2">
         <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-primary tracking-tight font-heading">My Active Portfolio</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
         </div>
         <p className="text-sm text-muted font-medium flex items-center gap-2">
            <Info size={14} className="text-accent/60" />
            Showing only projects with assigned tasks or stories.
         </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {filteredProjects.map((project) => {
          const stats = projectStats[project.id || project._id] || { tasks: 0, stories: 0 };
          return (
            <EmployeeProjectCard
              key={project.id || project._id}
              project={project}
              taskCount={stats.tasks}
              storyCount={stats.stories}
            />
          );
        })}
      </div>
    </div>
  );
}
