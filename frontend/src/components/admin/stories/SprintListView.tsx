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
import StartSprintModal from "./modals/StartSprintModal";

interface SprintListViewProps {
  projectId: string;
}

const SprintListView: React.FC<SprintListViewProps> = ({ projectId }) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [sprintToStart, setSprintToStart] = useState<Sprint | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sprintsResult, storiesResult, employeesData] = await Promise.all([
        getSprintsByProjectAction(projectId),
        getStoriesByProjectAction(projectId),
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
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'COMPLETED':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    }
  };

  if (loading && sprints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <Loader2 className="animate-spin text-orange-500/40" size={32} />
        <p className="text-slate-500 font-black tracking-[0.3em] text-[10px] uppercase">Syncing Sprint Data...</p>
      </div>
    );
  }

  if (sprints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center animate-in fade-in duration-700">
        <div className="w-20 h-20 rounded-[2.5rem] bg-orange-500/5 flex items-center justify-center text-orange-500/20 border border-orange-500/10 mb-8">
          <Timer size={32} />
        </div>
        <h3 className="text-xl font-black text-white mb-3 tracking-tighter">
          Sprint Management
        </h3>
        <p className="text-slate-500 text-sm max-w-[300px] leading-relaxed font-medium mb-8">
          No sprints have been created for this project yet. Go to the Backlog tab to plan your first sprint.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-6">
        <div className="flex items-center gap-4">
           <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500">
              <Timer size={24} />
           </div>
           <div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase">Sprint Roadmap</h2>
              <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-1">
                 {sprints.length} Active & Planned Cycles
              </p>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {sprints.map((sprint) => {
          const sprintAddedStories = stories.filter(s => sprint.issueIds.includes(s.id));
          
          return (
            <div 
              key={sprint.id}
              className="group relative border border-white/[0.05] bg-white/[0.01] rounded-[2.5rem] transition-all duration-300 overflow-hidden hover:bg-white/[0.02]"
            >
              {/* Sprint Header */}
              <div className="p-8 pb-6 flex items-center justify-between border-b border-white/[0.03]">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500">
                      <Timer size={24} />
                  </div>
                  <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-black text-white tracking-tight">{sprint.name}</h3>
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                          getStatusStyles(sprint.status)
                        )}>
                          {sprint.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                          <Hash size={14} className="text-orange-500/50" />
                          {sprint.issueIds.length} Objectives
                        </span>
                        {sprint.startDate && (
                          <span className="flex items-center gap-2">
                            <Calendar size={14} className="text-emerald-500/50" />
                            {new Date(sprint.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            {sprint.endDate && ` — ${new Date(sprint.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                          </span>
                        )}
                      </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {sprint.status === 'PLANNED' && (
                    <Button
                      variant="primary"
                      onClick={() => setSprintToStart(sprint)}
                      className="h-11 px-8 rounded-xl bg-emerald-500 text-[#08090a] font-black text-[11px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10"
                    >
                      <Play size={16} className="mr-2" />
                      Start Sprint
                    </Button>
                  )}
                  <button className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-500 hover:text-white transition-all">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Sprint Goal */}
              {sprint.goal && (
                <div className="px-8 py-4 bg-white/[0.005] border-b border-white/[0.03]">
                   <p className="text-xs text-slate-400 leading-relaxed italic opacity-80 flex items-start gap-3">
                     <Target size={14} className="text-orange-500 shrink-0 mt-0.5" />
                     "{sprint.goal}"
                   </p>
                </div>
              )}

              {/* Stories List */}
              <div className="p-4 space-y-2">
                {sprintAddedStories.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {sprintAddedStories.map((story) => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        employees={employees}
                        // We don't need edit/delete here as this is a read-only list for the sprint view
                        onEdit={() => {}}
                        onDelete={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-white/[0.005] rounded-[2rem] border border-dashed border-white/[0.05] mx-4 mb-4">
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
                      No objectives assigned to this sprint yet
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
    </div>
  );
};

export default SprintListView;
