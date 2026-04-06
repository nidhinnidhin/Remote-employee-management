"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlignLeft, CheckSquare, Layers, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { Task } from "@/shared/types/company/projects/task.type";
import StoryPriorityBadge from "@/components/admin/stories/StoryPriorityBadge";
import StoryStatusBadge from "@/components/admin/stories/StoryStatusBadge";
import AcceptanceCriteriaList from "@/components/admin/stories/AcceptanceCriteriaList";
import EmployeeInlineTaskList from "../tasks/EmployeeInlineTaskList";

interface EmployeeStoryCardProps {
  story: UserStory;
  tasks: Task[];
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
        "group rounded-xl transition-all duration-300 border overflow-hidden",
        isExpanded
          ? "bg-white/[0.03] border-accent/20 shadow-xl"
          : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0",
            isExpanded ? "bg-accent text-[#08090a]" : "bg-white/5 text-slate-500 group-hover:text-accent"
          )}>
            <Layers size={16} />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black text-accent/50 uppercase tracking-tighter">US-{story.id?.toString().slice(-3) || '00'}</span>
               <h4 className="text-[14px] font-bold text-white tracking-tight truncate">
                {story.title}
              </h4>
            </div>
            {!isExpanded && (
              <p className="text-[11px] text-slate-500 truncate max-w-[450px]">
                {story.description || "No description provided."}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 scale-90">
            <StoryPriorityBadge priority={story.priority} />
            <StoryStatusBadge status={story.status} />
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className={cn("text-slate-600 transition-colors", isExpanded && "text-white")}
          >
            <ChevronDown size={16} strokeWidth={3} />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-5">
              {/* Main Info Block - Tightened Grid */}
              <div className="flex flex-col lg:flex-row gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                
                {/* Objective - Flexible width */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-accent/70">
                    <Target size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Objective</span>
                  </div>
                  <p className="text-slate-300 text-[13px] leading-relaxed pl-5">
                    {story.description || "Detailed scope for this user story."}
                  </p>
                </div>

                {/* Vertical Divider for Desktop */}
                <div className="hidden lg:block w-px bg-white/5 self-stretch" />

                {/* Success Criteria - Fixed width on large screens to fill space */}
                <div className="lg:w-[40%] space-y-2">
                  <div className="flex items-center gap-2 text-accent/70">
                    <CheckSquare size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Success Criteria</span>
                  </div>
                  <div className="pl-5">
                    <AcceptanceCriteriaList 
                        criteria={story.acceptanceCriteria} 
                        className="!text-[12px] !text-slate-400 !space-y-1.5" 
                    />
                  </div>
                </div>
              </div>

              {/* Tasks Section */}
              <div className="mt-5">
                 <div className="flex items-center gap-3 mb-3">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] whitespace-nowrap">Roster & Tasks</span>
                    <div className="h-px w-full bg-white/5"></div>
                 </div>
                 <EmployeeInlineTaskList 
                    tasks={tasks} 
                    onRefresh={onRefresh}
                 />
              </div>

              {/* Mobile View Badges */}
              <div className="flex md:hidden items-center gap-2 mt-4 pt-4 border-t border-white/5">
                <StoryPriorityBadge priority={story.priority} />
                <StoryStatusBadge status={story.status} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}