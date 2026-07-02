"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Loader2,
  Sparkles,
  Filter,
  Search,
  Plus,
  Timer,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskStatus } from "@/shared/types/company/projects/task.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import {
  UserStory,
  UserStoryPriority,
} from "@/shared/types/company/projects/user-story.type";
import { getStoriesByProjectAction } from "@/actions/company/projects/story.actions";
import { getTasksByStoryAction } from "@/actions/company/projects/task.actions";
import { getEmployees } from "@/services/company/employee-management.service";
import {
  getSprintsByProjectAction,
  updateSprintAction,
} from "@/actions/company/projects/sprint.actions";
import { Sprint } from "@/shared/types/company/projects/sprint.type";
import { toast } from "sonner";
import KanbanBoard from "./KanbanBoard";
import Button from "@/components/ui/Button";
import CompleteSprintModal from "./modals/CompleteSprintModal";
import { useMemo } from "react";

interface BoardViewProps {
  projectId: string;
  projectMembers?: string[];
}

const BoardView: React.FC<BoardViewProps> = ({
  projectId,
  projectMembers = [],
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

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
        const filteredEmployees = (employeesData as Employee[]).filter(
          (emp) => {
            const isMember =
              projectMembers.length > 0
                ? projectMembers.includes(emp.id) ||
                  projectMembers.includes((emp as any)._id)
                : true;
            return isMember && emp.isActive;
          },
        );
        setEmployees(filteredEmployees);
      }

      // 2. Find Active Sprint
      const active =
        sprintsResult.success && sprintsResult.data
          ? sprintsResult.data.find((s) => s.status === "ACTIVE")
          : null;

      setActiveSprint(active || null);

      if (!active) {
        setStories([]);
        setTasks([]);
        setLoading(false);
        return;
      }

      // 3. Filter Stories for Active Sprint
      const activeStories = storiesResult.data.filter((story) =>
        active.issueIds.includes(story.id),
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
        status: "COMPLETED",
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

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority =
        !priorityFilter || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Board Header Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 py-2">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl p-2 font-black text-primary tracking-tighter">
              Project Kanban
            </h2>
            <p className="text-[10px] p-2 font-black text-muted uppercase tracking-widest">
              Visualizing {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "task" : "tasks"}
              {searchQuery || statusFilter || priorityFilter
                ? " (filtered)"
                : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative group w-full md:w-64">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find tasks..."
              className="w-full pl-10 pr-4 py-2 bg-white/[0.02] border border-white/10 rounded-xl text-[11px] font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/40 focus:bg-white/[0.04] transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:outline-none focus:border-accent/40 transition-all cursor-pointer hover:bg-white/5"
          >
            <option value="">Status</option>
            {Object.values(TaskStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full md:w-auto bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:outline-none focus:border-accent/40 transition-all cursor-pointer hover:bg-white/5"
          >
            <option value="">Priority</option>
            {Object.values(UserStoryPriority).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {activeSprint && (
            <Button
              onClick={handleCompleteSprint}
              isLoading={completing}
              className="w-full md:w-auto rounded-xl bg-emerald-500 text-[#08090a] gap-2 h-10 px-6 text-[10px] uppercase tracking-widest font-black shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <CheckCircle2 size={14} strokeWidth={3} />
              Complete Sprint
            </Button>
          )}
        </div>
      </div>
      <KanbanBoard
        tasks={filteredTasks}
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
