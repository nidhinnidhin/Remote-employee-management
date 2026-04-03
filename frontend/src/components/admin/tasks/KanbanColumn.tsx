"use client";

import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskStatus } from "@/shared/types/company/projects/task.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import TaskCard from "./TaskCard";
import Button from "@/components/ui/Button";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  employees: Employee[];
  stories: UserStory[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  employees,
  stories,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const getColumnColor = () => {
    switch (status) {
      case TaskStatus.TODO:
        return "rgb(var(--color-secondary))";
      case TaskStatus.IN_PROGRESS:
        return "rgb(var(--color-accent))";
      case TaskStatus.DONE:
        return "rgb(var(--color-success))";
      default:
        return "rgb(var(--color-muted))";
    }
  };

  return (
    <div className="flex flex-col w-[320px] shrink-0 h-full bg-[rgb(var(--color-surface))]/30 rounded-3xl border border-border-subtle/20 overflow-hidden shadow-sm">
      {/* Column Header */}
      <div 
        className="p-4 border-b border-border-subtle/10 flex items-center justify-between sticky top-0 bg-[rgb(var(--color-surface))]/80 backdrop-blur-md z-10"
        style={{ borderTop: `4px solid ${getColumnColor()}` }}
      >
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-black text-primary tracking-tight">{status}</h3>
          <span className="px-2 py-0.5 rounded-full bg-surface-raised/40 border border-border-subtle/10 text-[10px] font-black text-muted transition-all group-hover:scale-110">
            {tasks.length}
          </span>
        </div>
        <button className="text-muted/40 hover:text-accent transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "flex-1 p-3 overflow-y-auto space-y-3 transition-colors duration-200 min-h-[200px]",
              snapshot.isDraggingOver ? "bg-accent/5" : ""
            )}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => {
                   const story = stories.find(s => s.id === task.storyId);
                   return (
                     <TaskCard
                       task={task}
                       employees={employees}
                       storyTitle={story?.title}
                       onEdit={onEditTask}
                       onDelete={onDeleteTask}
                       isDraggable
                       innerRef={provided.innerRef}
                       draggableProps={provided.draggableProps}
                       dragHandleProps={provided.dragHandleProps}
                     />
                   );
                }}
              </Draggable>
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-border-subtle/10 rounded-2xl animate-in fade-in duration-500">
                <p className="text-[11px] font-bold text-muted/60 italic leading-relaxed">
                  No tasks in <br /> {status}
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Add Task Button (Always at bottom for Todo, or per-column UX) */}
      <div className="p-3 border-t border-border-subtle/10 bg-[rgb(var(--color-surface))]/20">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 h-10 px-3 text-[11px] font-black uppercase tracking-widest text-muted hover:text-accent hover:bg-accent/10 rounded-xl"
          onClick={onAddTask}
        >
          <Plus size={14} />
          <span>Add Task</span>
        </Button>
      </div>
    </div>
  );
};

export default KanbanColumn;
