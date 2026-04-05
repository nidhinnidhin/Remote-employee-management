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
        return "rgb(var(--color-accent))";
      case TaskStatus.IN_PROGRESS:
        // A soft, light gold / warm amber color
        return "rgb(251, 191, 36)";
      case TaskStatus.DONE:
        return "rgb(var(--color-success))";
      default:
        return "rgb(var(--color-muted))";
    }
  };

  return (
    <div
      className="flex flex-col w-[300px] shrink-0 h-full rounded-xl transition-all duration-300"
      style={{
        backgroundColor: `color-mix(in srgb, ${getColumnColor()} 10%, transparent)`,
      }}
    >
      {/* Column Header */}
      <div className="p-3.5 flex items-center justify-between sticky top-0 bg-background/50 backdrop-blur-md z-10 rounded-t-xl">
        <div className="flex items-center gap-2.5">
          <div
            className="w-2.5 h-2.5 rounded-full shadow-sm"
            style={{ backgroundColor: getColumnColor() }}
          />
          <h3 className="text-sm font-semibold text-primary tracking-tight">
            {status}
          </h3>
          <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md bg-muted/10 text-[11px] font-medium text-muted-foreground transition-all group-hover:scale-110">
            {tasks.length}
          </span>
        </div>
        <button className="p-1.5 text-muted-foreground/50 hover:text-primary hover:bg-muted/10 rounded-md transition-colors">
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
              "flex-1 p-2.5 overflow-y-auto space-y-2.5 transition-all duration-200 min-h-[200px] rounded-lg mx-1",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              snapshot.isDraggingOver ? "ring-1 ring-inset" : "",
            )}
            style={{
              backgroundColor: snapshot.isDraggingOver
                ? `color-mix(in srgb, ${getColumnColor()} 15%, transparent)`
                : "transparent",
              borderColor: snapshot.isDraggingOver
                ? `color-mix(in srgb, ${getColumnColor()} 40%, transparent)`
                : "transparent",
            }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => {
                  const story = stories.find((s) => s.id === task.storyId);
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
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center rounded-xl animate-in fade-in duration-500 mt-2">
                <p className="text-[11px] font-medium text-muted-foreground/70 leading-relaxed">
                  No tasks in <br /> {status}
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Add Task Button */}
      <div className="p-2 bg-[rgb(var(--color-surface))]/30 rounded-b-xl">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 h-9 px-3 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-surface/60 rounded-xl transition-all"
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
