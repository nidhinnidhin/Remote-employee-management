"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlignLeft, CheckSquare, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { Task } from "@/shared/types/company/projects/task.type";
import StoryPriorityBadge from "@/components/admin/stories/StoryPriorityBadge";
import StoryStatusBadge from "@/components/admin/stories/StoryStatusBadge";
import StoryPointsBadge from "@/components/admin/stories/StoryPointsBadge";
import AcceptanceCriteriaList from "@/components/admin/stories/AcceptanceCriteriaList";
import EmployeeInlineTaskList from "../tasks/EmployeeInlineTaskList";

interface EmployeeStoryCardProps {
  story: UserStory;
  tasks: Task[]; // Scoped to this story and current user
  onRefresh?: () => void;
}

export default function EmployeeStoryCard({
  story,
  tasks,
  onRefresh,
}: EmployeeStoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "group portal-card overflow-hidden transition-all duration-500",
        isExpanded 
            ? "bg-[rgb(var(--color-surface-raised))]/60 border-[rgba(var(--color-accent),0.3)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)]" 
            : "bg-[rgb(var(--color-surface))]/30 border-[rgba(var(--color-border-subtle),0.1)] hover:border-[rgba(var(--color-accent),0.2)] hover:bg-[rgb(var(--color-surface-raised))]/40"
      )}
    >
      <div
        className="flex items-center justify-between p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-accent-subtle/20 flex items-center justify-center text-accent shrink-0 transition-transform group-hover:scale-110">
             <Layers size={20} />
          </div>
          <div className="flex flex-col min-w-0">
             <h4 className="text-[15px] font-bold text-primary truncate tracking-tight">
                {story.title}
             </h4>
             {!isExpanded && story.description && (
                <p className="text-[11px] text-muted truncate max-w-[280px] opacity-60">
                   {story.description}
                </p>
             )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <StoryPriorityBadge priority={story.priority} className="scale-90" />
            <StoryPointsBadge points={story.storyPoints} className="scale-90" />
            <StoryStatusBadge status={story.status} className="scale-90" />
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-muted/40 ml-2"
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="px-6 pb-6 pt-2 border-t border-[rgba(var(--color-border-subtle),0.1)] bg-black/[0.05]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-accent/60">
                     <AlignLeft size={14} />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] pt-0.5">Objective</span>
                  </div>
                  <p className="text-secondary text-[13.5px] leading-relaxed pl-7 font-medium">
                    {story.description || "No detailed description provided."}
                  </p>
                </div>

                {/* Acceptance Criteria */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-accent/60">
                     <CheckSquare size={14} />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] pt-0.5">Success Criteria</span>
                  </div>
                  <div className="pl-7">
                    <AcceptanceCriteriaList criteria={story.acceptanceCriteria} className="!text-[13px] !text-muted/80 !leading-relaxed" />
                  </div>
                </div>
              </div>

              {/* Tasks Section */}
              <div className="mt-10 pt-6 border-t border-[rgba(var(--color-border-subtle),0.05)]">
                 <EmployeeInlineTaskList 
                    tasks={tasks} 
                    onRefresh={onRefresh}
                 />
              </div>

              {/* Mobile Badges */}
              <div className="flex sm:hidden flex-wrap items-center gap-2 mt-8 pt-4 border-t border-border-subtle/10">
                <StoryPriorityBadge priority={story.priority} />
                <StoryStatusBadge status={story.status} />
                <StoryPointsBadge points={story.storyPoints} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
