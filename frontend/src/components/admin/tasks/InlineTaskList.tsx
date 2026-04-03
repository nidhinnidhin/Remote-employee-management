"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, ListTodo, Loader2, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/shared/types/company/projects/task.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { getTasksByStoryAction } from "@/actions/company/projects/task.actions";
import { toast } from "sonner";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./modals/CreateTaskModal";
import EditTaskModal from "./modals/EditTaskModal";
import DeleteTaskConfirmation from "./modals/DeleteTaskConfirmation";
import Button from "@/components/ui/Button";

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
    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-1 duration-500">
      <div className="flex items-center justify-between border-b border-border-subtle/10 pb-2">
        <div className="flex items-center gap-2">
          <ListChecks size={14} className="text-accent/60" />
          <h6 className="text-[10px] font-black uppercase tracking-widest text-primary">Task List</h6>
          <span className="px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-[9px] font-bold text-accent">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          className="h-7 py-0 px-2.5 rounded-lg text-accent hover:bg-accent/10 text-[10px] font-black uppercase tracking-widest gap-1.5 shadow-sm border border-accent/10 hover:border-accent/40"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={12} />
          <span>Add Task</span>
        </Button>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 w-full rounded-2xl bg-surface-raised/20 animate-pulse border border-border-subtle/5" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3 border-2 border-dashed border-border-subtle/10 rounded-2xl bg-black/5">
            <p className="text-[11px] font-bold text-muted italic">No tasks created yet for this story.</p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline flex items-center gap-1.5"
            >
              <Plus size={10} />
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

      {/* Modals */}
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
