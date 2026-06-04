"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckSquare, Layers, Target, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { Task } from "@/shared/types/company/projects/task.type";
import StoryPriorityBadge from "@/components/admin/stories/StoryPriorityBadge";
import StoryStatusBadge from "@/components/admin/stories/StoryStatusBadge";
import AcceptanceCriteriaList from "@/components/admin/stories/AcceptanceCriteriaList";
import EmployeeInlineTaskList from "../tasks/EmployeeInlineTaskList";
import ProjectCommentsModal from "../projects/ProjectCommentsModal";
import { CommentEntityType } from "@/shared/types/company/projects/comment.type";

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
  const [commentsOpen, setCommentsOpen] = useState(false);

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
              <span className="text-[9px] font-black text-accent/50 uppercase tracking-tighter">US-{story.storyNumber || 'NEW'}</span>
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
          <div className="hidden md:flex items-center gap-3 scale-90">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent">
               <span className="text-[9px] font-black uppercase tracking-tighter">Points</span>
               <span className="text-[12px] font-black leading-none">{story.storyPoints || 0}</span>
            </div>
            <StoryPriorityBadge priority={story.priority} />
            <StoryStatusBadge status={story.status} />
          </div>

          {/* Comments Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCommentsOpen(true);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/[0.08] text-slate-500 hover:text-accent hover:border-accent/30 hover:bg-accent/10 transition-all duration-200"
            title="View Comments"
          >
            <MessageSquare size={14} />
          </button>

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

              {/* Resources & Assets */}
              {((story.attachments && story.attachments.length > 0) || (story.links && story.links.length > 0)) && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] whitespace-nowrap">Resources & Assets</span>
                    <div className="h-px w-full bg-white/5"></div>
                  </div>

                  <div className="space-y-5">
                    {/* Image Attachments */}
                    {story.attachments && story.attachments.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Attachments</span>
                        <div className="flex flex-wrap gap-3">
                          {story.attachments.map((src, idx) => (
                            <div 
                              key={idx} 
                              className="relative group w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer shadow-lg hover:border-accent/40 transition-all duration-300"
                              onClick={() => window.open(src, '_blank')}
                            >
                              <img src={src} alt={`Attachment ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Layers size={16} className="text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* External Links */}
                    {story.links && story.links.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Documentation Links</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {story.links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-accent/30 hover:bg-white/[0.04] transition-all group shadow-sm"
                            >
                              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent/60 group-hover:text-accent transition-colors shrink-0">
                                <Layers size={12} />
                              </div>
                              <span className="text-[12px] text-slate-400 group-hover:text-slate-200 truncate">{link}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

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

      {/* Story Comments Modal */}
      <ProjectCommentsModal
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        entityId={story.id?.toString() || (story as any)._id?.toString() || ""}
        entityType={CommentEntityType.USER_STORY}
        title={`Comments — ${story.title}`}
      />
    </div>
  );
}