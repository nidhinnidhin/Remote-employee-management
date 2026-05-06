"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Layout, Loader2, Sparkles, Filter, Search, Plus, Timer, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/shared/types/company/projects/task.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { getStoriesByProjectAction } from "@/actions/company/projects/story.actions";
import { getTasksByStoryAction } from "@/actions/company/projects/task.actions";
import { getEmployees } from "@/services/company/employee-management.service";
import { getSprintsByProjectAction, updateSprintAction } from "@/actions/company/projects/sprint.actions";
import { Sprint } from "@/shared/types/company/projects/sprint.type";
import { toast } from "sonner";
import KanbanBoard from "./KanbanBoard";
import Button from "@/components/ui/Button";
import CompleteSprintModal from "./modals/CompleteSprintModal";

interface BoardViewProps {
  projectId: string;
  projectMembers?: string[];
}

const BoardView: React.FC<BoardViewProps> = ({ projectId, projectMembers = [] }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Stories, Employees, and Sprints
      const [storiesResult, sprintsResult, employeesData] = await Promise.all([
        getStoriesByProjectAction(projectId),
        getSprintsByProjectAction(projectId),
        getEmployees(),
      ]);

      if (!storiesResult.success || !storiesResult.data) {
        toast.error(storiesResult.error || "Failed to load project structure");
        setLoading(false);
        return;
      }

      if (employeesData) {
        // Filter employees to only show those assigned to the project AND active
        const filteredEmployees = (employeesData as Employee[]).filter(emp => {
          const isMember = projectMembers.length > 0 
            ? projectMembers.includes(emp.id) || projectMembers.includes((emp as any)._id)
            : true;
          return isMember && emp.isActive;
        });
        setEmployees(filteredEmployees);
      }

      // 2. Find Active Sprint
      const active = sprintsResult.success && sprintsResult.data 
        ? sprintsResult.data.find(s => s.status === 'ACTIVE') 
        : null;
      
      setActiveSprint(active || null);

      if (!active) {
        setStories([]);
        setTasks([]);
        setLoading(false);
        return;
      }

      // 3. Filter Stories for Active Sprint
      const activeStories = storiesResult.data.filter(story => 
        active.issueIds.includes(story.id)
      );
      setStories(activeStories);

      // 4. Fetch Tasks for each active story (Parallel)
      const tasksPromises = activeStories.map((story) =>
        getTasksByStoryAction(story.id),
      );
      const tasksResults = await Promise.all(tasksPromises);

      const allTasks: Task[] = [];
      tasksResults.forEach((res) => {
        if (res.success && res.data) {
          allTasks.push(...res.data);
        }
      });

      setTasks(allTasks);
    } catch (error) {
      console.error("Error fetching board data:", error);
      toast.error("An unexpected error occurred while loading the board");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCompleteSprint = () => {
    if (!activeSprint) return;
    setIsCompleteModalOpen(true);
  };

  const confirmCompleteSprint = async () => {
    if (!activeSprint) return;

    setCompleting(true);
    try {
      const result = await updateSprintAction(activeSprint.id, {
        status: 'COMPLETED'
      });

      if (result.success) {
        toast.success(`Sprint "${activeSprint.name}" completed successfully`);
        setIsCompleteModalOpen(false);
        fetchData();
      } else {
        toast.error(result.error || "Failed to complete sprint");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setCompleting(false);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 animate-in fade-in duration-700">
        <div className="relative">
          <Loader2
            className="animate-spin text-accent"
            size={56}
            strokeWidth={1}
          />
          <div className="absolute inset-0 blur-2xl bg-accent/30 animate-pulse" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-secondary font-black tracking-widest text-xs uppercase">
            Assembling Board View...
          </p>
          <p className="text-muted text-[10px] font-bold">
            Synchronizing stories and task states
          </p>
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 rounded-[3rem] bg-accent/5 flex items-center justify-center text-accent/20 border border-accent/10 mb-8 border-dashed">
          <Layout size={48} className="translate-y-0.5" />
        </div>
        <h3 className="text-2xl font-black text-primary mb-3 tracking-tight">
          Board Restricted
        </h3>
        <p className="text-muted text-sm max-w-[320px] leading-relaxed mb-10 font-bold opacity-80">
          The Kanban board requires at least one User Story to track tasks.
          Please define a requirement in the Backlog first.
        </p>
        <Button
          variant="primary"
          className="shadow-2xl shadow-accent/20 px-10 py-4 h-auto text-xs uppercase tracking-widest font-black"
          onClick={() => (window.location.hash = "backlog")}
        >
          Return to Backlog
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Board Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10  flex items-center justify-center text-accent shadow-inner">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-primary tracking-tighter">
              Project Kanban
            </h2>
            <p className="text-[10px] font-black text-muted uppercase tracking-widest">
              Visualizing {tasks.length}{" "}
              {tasks.length === 1 ? "active task" : "active tasks"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeSprint && (
            <Button
              onClick={handleCompleteSprint}
              isLoading={completing}
              className="rounded-xl bg-emerald-500 text-[#08090a] gap-2 h-10 px-6 text-[10px] uppercase tracking-widest font-black shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <CheckCircle2 size={14} strokeWidth={3} />
              Complete Sprint
            </Button>
          )}
          <Button
            variant="ghost"
            className="rounded-xl border border-border-subtle/20 gap-2 h-10 text-[10px] uppercase tracking-widest font-black"
          >
            <Filter size={14} />
            Filters
          </Button>
          <Button
            variant="ghost"
            className="rounded-xl border border-border-subtle/20 gap-2 h-10 text-[10px] uppercase tracking-widest font-black"
          >
            <Search size={14} />
            Find
          </Button>
        </div>
      </div>

      <KanbanBoard
        tasks={tasks}
        employees={employees}
        stories={stories}
        projectId={projectId}
        onRefresh={fetchData}
      />

      <CompleteSprintModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={confirmCompleteSprint}
        sprint={activeSprint}
        loading={completing}
      />
    </div>
  );
};

export default BoardView;
