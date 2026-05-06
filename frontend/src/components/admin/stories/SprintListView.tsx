"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Timer,
  Hash,
  Calendar,
  Play,
  MoreVertical,
  Target,
  Loader2,
  ChevronRight,
  Edit3,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Sprint } from "@/shared/types/company/projects/sprint.type";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { getSprintsByProjectAction } from "@/actions/company/projects/sprint.actions";
import { getStoriesByProjectAction } from "@/actions/company/projects/story.actions";
import { getEmployees } from "@/services/company/employee-management.service";
import { toast } from "sonner";
import StoryCard from "./StoryCard";
import SprintBurndown from "./SprintBurndown";
import { getTasksByProjectAction } from "@/actions/company/projects/task.actions";
import { Task } from "@/shared/types/company/projects/task.type";
import StartSprintModal from "./modals/StartSprintModal";
import EditSprintModal from "./modals/EditSprintModal";
import DeleteSprintConfirmationModal from "./modals/DeleteSprintConfirmationModal";
import DeleteSprintOptionsModal from "./modals/DeleteSprintOptionsModal";
import EditStoryModal from "./modals/EditStoryModal";
import DeleteStoryConfirmation from "./modals/DeleteStoryConfirmation";

interface SprintListViewProps {
  projectId: string;
}

const SprintListView: React.FC<SprintListViewProps> = ({ projectId }) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [sprintToStart, setSprintToStart] = useState<Sprint | null>(null);
  const [sprintToEdit, setSprintToEdit] = useState<Sprint | null>(null);
  const [sprintToDelete, setSprintToDelete] = useState<Sprint | null>(null);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [selectedStoryForEdit, setSelectedStoryForEdit] = useState<UserStory | null>(null);
  const [selectedStoryForDelete, setSelectedStoryForDelete] = useState<UserStory | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sprintsResult, storiesResult, tasksResult, employeesData] = await Promise.all([
        getSprintsByProjectAction(projectId),
        getStoriesByProjectAction(projectId),
        getTasksByProjectAction(projectId),
        getEmployees(),
      ]);

      if (sprintsResult.success && sprintsResult.data) {
        setSprints(sprintsResult.data);
      } else {
        toast.error(sprintsResult.error || "Failed to load sprints");
      }

      if (storiesResult.success && storiesResult.data) {
        setStories(storiesResult.data);
      } else {
        toast.error(storiesResult.error || "Failed to load stories");
      }

      if (tasksResult.success && tasksResult.data) {
        setTasks(tasksResult.data);
      }

      setEmployees(employeesData);
    } catch (error) {
      toast.error("An unexpected error occurred while loading sprint data");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "COMPLETED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "from-emerald-500/0 via-emerald-500/40 to-emerald-500/0";
      case "COMPLETED":
        return "from-blue-500/0 via-blue-500/40 to-blue-500/0";
      default:
        return "from-orange-500/0 via-orange-500/40 to-orange-500/0";
    }
  };

  if (loading && sprints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5">
        <Loader2 className="animate-spin text-orange-500/40" size={28} />
        <p className="text-slate-500 font-black tracking-[0.3em] text-[9px] uppercase">
          Syncing Roadmap...
        </p>
      </div>
    );
  }

  if (sprints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center animate-in fade-in duration-700">
        <div className="w-16 h-16 rounded-[2rem] bg-orange-500/5 flex items-center justify-center text-orange-500/20 border border-orange-500/10 mb-6">
          <Timer size={28} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-black text-white mb-2 tracking-tighter uppercase">
          No Cycles Found
        </h3>
        <p className="text-slate-500 text-xs max-w-[260px] leading-relaxed font-medium">
          The roadmap registry is empty. Initialize a sprint from the backlog to begin tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- REFINED COMPACT HEADER --- */}
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
            <Timer size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-widest uppercase">
              Sprint Roadmap
            </h2>
            <p className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-0.5">
              {sprints.length} Operational Cycles
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {sprints
          .sort((a, b) => {
            const statusOrder = { ACTIVE: 0, PLANNED: 1, COMPLETED: 2 };
            return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
          })
          .map((sprint) => {
            const sprintAddedStories = stories.filter((s) => 
              sprint.issueIds.some(id => id.toString() === s.id.toString())
            );

          return (
            <div
              key={sprint.id}
              className="group relative border border-white/[0.06] bg-white/[0.01] rounded-2xl transition-all duration-300 hover:bg-white/[0.02] hover:border-white/[0.1] overflow-hidden"
            >
              {/* Top Accent Gradient highlight */}
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 h-[1px] opacity-60",
                  `bg-gradient-to-r ${getStatusGradient(sprint.status)}`
                )}
              />

              {/* Card Header */}
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-2.5 rounded-xl border shrink-0",
                    getStatusStyles(sprint.status)
                  )}>
                    <Timer size={16} strokeWidth={3} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-sm font-black text-white uppercase tracking-tight">
                        {sprint.name}
                      </h3>
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                        getStatusStyles(sprint.status)
                      )}>
                        {sprint.status}
                      </span>
                    </div>

                    {/* Metadata Pills */}
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <Hash size={12} className="text-orange-500/40" />
                        {sprintAddedStories.length} Objectives
                      </span>
                      {/* Total Story Points */}
                      <span className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                        <Target size={12} className="text-accent/40" />
                        {sprintAddedStories.reduce((sum, s) => sum + (s.storyPoints || 0), 0)} Points
                      </span>
                      {sprint.startDate && (
                        <span className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                          <Calendar size={12} className="text-emerald-500/40" />
                          {new Date(sprint.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          {sprint.endDate && (
                            <>
                              <ChevronRight size={10} className="mx-0.5 text-slate-700" />
                              {new Date(sprint.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                   {/* Action Buttons */}
                   <div className="flex items-center gap-1 border-r border-white/10 pr-3 mr-1">
                      <button
                        onClick={() => setSprintToEdit(sprint)}
                        className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                        title="Edit Sprint"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => setSprintToDelete(sprint)}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                        title="Delete Sprint"
                      >
                        <Trash2 size={15} />
                      </button>
                   </div>

                   {sprint.status === 'PLANNED' && (
                     <Button
                       onClick={() => setSprintToStart(sprint)}
                       className="h-10 px-6 rounded-xl bg-emerald-500 text-[#08090a] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                     >
                       <Play size={12} strokeWidth={4} />
                       Start Sprint
                     </Button>
                   )}
                </div>
              </div>

              {/* Burndown Chart for Active Sprint */}
              {sprint.status === 'ACTIVE' && (
                <div className="px-6 pb-2">
                  <SprintBurndown 
                    sprint={sprint} 
                    tasks={tasks.filter(t => {
                      const tStoryId = t.storyId?.toString();
                      return sprintAddedStories.some(s => s.id.toString() === tStoryId);
                    })} 
                  />
                </div>
              )}

              {/* Sprint Goal - Compact Bar */}
              {sprint.goal && (
                <div className="px-6 py-2.5 bg-white/[0.005] border-y border-white/[0.03]">
                  <div className="flex items-start gap-2.5 ml-12">
                    <Target size={12} className="text-orange-500/50 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-slate-400 font-medium italic opacity-80 leading-relaxed">
                      "{sprint.goal}"
                    </p>
                  </div>
                </div>
              )}

              {/* Stories List (Darkened Container) */}
              <div className="p-3 bg-black/20">
                {sprintAddedStories.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {sprintAddedStories.map((story) => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        employees={employees}
                        onEdit={() => setSelectedStoryForEdit(story)}
                        onDelete={() => setSelectedStoryForDelete(story)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center bg-white/[0.01] rounded-xl border border-dashed border-white/[0.05]">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
                      Registry Empty: No items assigned
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <StartSprintModal
        isOpen={!!sprintToStart}
        onClose={() => setSprintToStart(null)}
        onSuccess={fetchData}
        sprint={sprintToStart}
      />

      <EditSprintModal
        isOpen={!!sprintToEdit}
        onClose={() => setSprintToEdit(null)}
        onSuccess={fetchData}
        sprint={sprintToEdit}
      />

      <DeleteSprintConfirmationModal
        isOpen={!!sprintToDelete && !showDeleteOptions}
        onClose={() => setSprintToDelete(null)}
        onConfirm={() => setShowDeleteOptions(true)}
        sprint={sprintToDelete}
      />

      <DeleteSprintOptionsModal
        isOpen={showDeleteOptions}
        onClose={() => {
          setShowDeleteOptions(false);
          setSprintToDelete(null);
        }}
        onSuccess={fetchData}
        sprint={sprintToDelete}
      />

      <EditStoryModal
        isOpen={!!selectedStoryForEdit}
        onClose={() => setSelectedStoryForEdit(null)}
        onSuccess={fetchData}
        story={selectedStoryForEdit}
        employees={employees}
      />

      <DeleteStoryConfirmation
        isOpen={!!selectedStoryForDelete}
        onClose={() => setSelectedStoryForDelete(null)}
        onSuccess={fetchData}
        story={selectedStoryForDelete}
      />
    </div>
  );
};

export default SprintListView;