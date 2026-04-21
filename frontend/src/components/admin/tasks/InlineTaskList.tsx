"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/shared/types/company/projects/task.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { getTasksByStoryAction } from "@/actions/company/projects/task.actions";
import { toast } from "sonner";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./modals/CreateTaskModal";
import EditTaskModal from "./modals/EditTaskModal";
import DeleteTaskConfirmation from "./modals/DeleteTaskConfirmation";

interface InlineTaskListProps {
  storyId: string;
  projectId: string;
  employees: Employee[];
}

const InlineTaskList: React.FC<InlineTaskListProps> = ({ storyId, projectId, employees }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [selectedTaskForDelete, setSelectedTaskForDelete] = useState<Task | null>(null);

  // Sync with StoryCard border style
  const zincBorder = "border-zinc-700/80";

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const result = await getTasksByStoryAction(storyId);
    if (result.success && result.data) {
      setTasks(result.data.sort((a, b) => a.order - b.order));
    } else {
      toast.error(result.error || "Failed to load tasks");
    }
    setLoading(false);
  }, [storyId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-400">
      {/* --- HEADER SECTION --- */}
      <div className={cn("flex items-center justify-between pb-3 border-b", zincBorder)}>
        <div className="flex items-center gap-2">
          <ListChecks size={14} className="text-zinc-500" strokeWidth={2.5} />
          <h6 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Task List
          </h6>
          <span className="ml-1 px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400 tabular-nums">
            {tasks.length}
          </span>
        </div>

        {/* --- CUSTOM ADD TASK BUTTON --- */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 h-7 px-3 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold uppercase tracking-widest transition-all border border-zinc-700 active:scale-95"
        >
          <Plus size={12} strokeWidth={3} />
          <span>Add Task</span>
        </button>
      </div>

      {/* --- TASKS GRID --- */}
      <div className="min-h-[40px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <div 
                key={i} 
                className={cn("h-24 w-full rounded-md bg-zinc-900/40 animate-pulse border", zincBorder)} 
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className={cn(
            "flex flex-col items-center justify-center py-10 gap-3 border border-dashed rounded-md bg-zinc-900/20", 
            zincBorder
          )}>
            <p className="text-[11px] font-medium text-zinc-500">No tasks created yet for this story.</p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-accent/80 flex items-center gap-1.5 transition-colors"
            >
              <Plus size={12} strokeWidth={2.5} />
              Create First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                employees={employees}
                onEdit={setSelectedTaskForEdit}
                onDelete={setSelectedTaskForDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchTasks}
        projectId={projectId}
        storyId={storyId}
        employees={employees}
      />
      <EditTaskModal
        isOpen={!!selectedTaskForEdit}
        onClose={() => setSelectedTaskForEdit(null)}
        onSuccess={fetchTasks}
        task={selectedTaskForEdit}
        employees={employees}
      />
      <DeleteTaskConfirmation
        isOpen={!!selectedTaskForDelete}
        onClose={() => setSelectedTaskForDelete(null)}
        onSuccess={fetchTasks}
        task={selectedTaskForDelete}
      />
    </div>
  );
};

export default InlineTaskList;