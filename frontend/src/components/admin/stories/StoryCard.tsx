"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Edit3,
  Trash2,
  AlignLeft,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import StoryPriorityBadge from "./StoryPriorityBadge";
import StoryStatusBadge from "./StoryStatusBadge";
import StoryPointsBadge from "./StoryPointsBadge";
import AssigneeDisplay from "./AssigneeDisplay";
import AcceptanceCriteriaList from "./AcceptanceCriteriaList";
import InlineTaskList from "../tasks/InlineTaskList";

interface StoryCardProps {
  story: UserStory;
  employees: Employee[];
  onEdit: (story: UserStory) => void;
  onDelete: (story: UserStory) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({
  story,
  employees,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const assignee = employees.find((e) => e.id === story.assigneeId);

  // REFINED: Thicker Zinc border for better structure
  const zincBorder = "border-zinc-700/80";

  return (
    <div
      className={cn(
        "group transition-all duration-200 border-b",
        zincBorder,
        isExpanded
          ? "bg-[rgb(var(--color-surface-raised))]/30"
          : "bg-transparent hover:bg-[rgb(var(--color-bg-subtle))]/20",
      )}
    >
      {/* --- HEADER ROW --- */}
      <div
        className="flex items-center h-14 px-4 cursor-pointer gap-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="text-[14px] font-bold text-primary truncate leading-tight">
            {story.title}
          </h4>
          {!isExpanded && story.description && (
            <p className="text-[11px] text-muted/40 truncate max-w-[400px] mt-0.5">
              {story.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <StoryPriorityBadge priority={story.priority} />
            <StoryPointsBadge points={story.storyPoints} />
            <StoryStatusBadge status={story.status} />
          </div>

          <AssigneeDisplay
            name={assignee?.name}
            avatar={assignee?.avatar}
            className="hidden md:flex"
          />

          {/* Action Bar Vertical Divider - Matching the Zinc Border */}
          <div
            className={cn(
              "flex items-center h-8 gap-0.5 ml-2 pl-3 border-l",
              zincBorder,
            )}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(story);
              }}
              className="flex items-center justify-center h-8 w-8 rounded-md text-zinc-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
              <Edit3 size={15} strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(story);
              }}
              className="flex items-center justify-center h-8 w-8 rounded-md text-zinc-300 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-95"
            >
              <Trash2 size={15} strokeWidth={2} />
            </button>

            {/* Small action divider */}
            <div className={cn("w-[1px] h-4 mx-1 bg-zinc-700/50")} />

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="flex items-center justify-center w-8 h-8 text-zinc-400"
            >
              <ChevronDown size={18} strokeWidth={2.5} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- EXPANDED CONTENT --- */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className={cn("px-6 pb-5 pt-4 border-t bg-black/5", zincBorder)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Description */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-zinc-400 uppercase">
                    <AlignLeft size={13} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold tracking-widest pt-0.5">
                      Description
                    </span>
                  </div>
                  <div className={cn("pl-5 border-l-2", zincBorder)}>
                    <p className="text-secondary text-[13px] leading-relaxed">
                      {story.description || "No description provided."}
                    </p>
                  </div>
                </div>

                {/* Acceptance Criteria */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-zinc-400 uppercase">
                    <CheckSquare size={13} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold tracking-widest pt-0.5">
                      Acceptance Criteria
                    </span>
                  </div>
                  <div className={cn("pl-5 border-l-2", zincBorder)}>
                    <AcceptanceCriteriaList
                      criteria={story.acceptanceCriteria}
                    />
                  </div>
                </div>
              </div>

              {/* Task Section Divider - Thickened to match */}
              <div className={cn("pt-6 border-t", zincBorder)}>
                <InlineTaskList
                  storyId={story.id}
                  projectId={story.projectId}
                  employees={employees}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryCard;
