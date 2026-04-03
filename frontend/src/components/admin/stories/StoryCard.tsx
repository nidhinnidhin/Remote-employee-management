"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Edit3, Trash2, AlignLeft, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import StoryPriorityBadge from "./StoryPriorityBadge";
import StoryStatusBadge from "./StoryStatusBadge";
import StoryPointsBadge from "./StoryPointsBadge";
import AssigneeDisplay from "./AssigneeDisplay";
import AcceptanceCriteriaList from "./AcceptanceCriteriaList";
import Button from "@/components/ui/Button";

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

  return (
    <div
      className={cn(
        "group portal-card overflow-hidden transition-all duration-300 border-[rgba(var(--color-border-subtle),0.3)] hover:border-[rgba(var(--color-accent),0.3)]",
        isExpanded ? "bg-[rgb(var(--color-surface-raised))]/80 ring-1 ring-accent/20 shadow-lg" : "bg-[rgb(var(--color-surface))]/50 hover:bg-[rgb(var(--color-bg-subtle))]/60"
      )}
    >
      {/* Card Header/Row */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex flex-col min-w-0">
            <h4 className="text-[15px] font-bold text-primary truncate">
              {story.title}
            </h4>
            {story.description && !isExpanded && (
              <p className="text-[11px] text-muted truncate max-w-[300px]">
                {story.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <div className="hidden sm:flex items-center gap-2">
            <StoryPriorityBadge priority={story.priority} />
            <StoryPointsBadge points={story.storyPoints} />
            <StoryStatusBadge status={story.status} />
          </div>

          <AssigneeDisplay name={assignee?.name} avatar={assignee?.avatar} className="hidden md:flex ml-2" />

          <div className="flex items-center gap-1 border-l border-border-subtle/30 pl-2 ml-2">
            <Button
              variant="ghost"
              className="p-1.5 h-auto rounded-lg text-muted hover:text-accent hover:bg-accent/10"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(story);
              }}
            >
              <Edit3 size={14} />
            </Button>
            <Button
              variant="ghost"
              className="p-1.5 h-auto rounded-lg text-muted hover:text-danger hover:bg-danger/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(story);
              }}
            >
              <Trash2 size={14} />
            </Button>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="text-muted/40 ml-1"
            >
              <ChevronDown size={16} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 pt-2 border-t border-border-subtle/20 bg-black/5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Description Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-accent/80">
                    <AlignLeft size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest pt-0.5">Description</span>
                  </div>
                  <p className="text-secondary text-[13px] leading-relaxed pl-6">
                    {story.description || "No description provided."}
                  </p>
                </div>

                {/* Acceptance Criteria Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-accent/80">
                    <CheckSquare size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest pt-0.5">Acceptance Criteria</span>
                  </div>
                  <div className="pl-6">
                    <AcceptanceCriteriaList criteria={story.acceptanceCriteria} />
                  </div>
                </div>
              </div>

              {/* Mobile Badges (Shown only when expanded on mobile) */}
              <div className="flex sm:hidden flex-wrap items-center gap-2 mt-6 pt-4 border-t border-border-subtle/10">
                <StoryPriorityBadge priority={story.priority} />
                <StoryPointsBadge points={story.storyPoints} />
                <StoryStatusBadge status={story.status} />
                <AssigneeDisplay name={assignee?.name} avatar={assignee?.avatar} className="ml-auto" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryCard;
