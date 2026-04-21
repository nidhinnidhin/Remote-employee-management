"use client";

import React, { Fragment } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal, MousePointer2 } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
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
      className="flex flex-col w-[300px] shrink-0 min-h-screen rounded-xl transition-all duration-300"
      style={{
        backgroundColor: `color-mix(in srgb, ${getColumnColor()} 10%, transparent)`,
      }}
    >
      {/* Column Header */}
      <div className="p-3.5 flex items-center justify-between sticky top-0 bg-background/50 backdrop-blur-md z-20 rounded-t-xl border-b border-white/[0.03]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-2.5 h-2.5 rounded-full shadow-sm animate-pulse"
            style={{ backgroundColor: getColumnColor() }}
          />
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/70">
            {status}
          </h3>
          <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md bg-white/[0.05] text-[10px] font-black text-muted-foreground transition-all group-hover:scale-110">
            {tasks.length}
          </span>
        </div>

        {/* --- MODERN DROPDOWN MENU --- */}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="p-1.5 text-muted-foreground/50 hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-300 active:scale-90 border border-transparent hover:border-accent/20">
            <MoreHorizontal size={16} />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95 translate-y-[-10px]"
            enterTo="transform opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100 translate-y-0"
            leaveTo="transform opacity-0 scale-95 translate-y-[-10px]"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-white/[0.05] rounded-xl bg-[#0f172a]/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] focus:outline-none z-50">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onAddTask}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-200",
                        active ? "bg-accent text-black shadow-[0_0_20px_rgba(var(--color-accent),0.4)]" : "text-slate-300 hover:bg-white/[0.05]"
                      )}
                    >
                      <Plus className={cn("transition-transform group-hover:rotate-90", active ? "text-black" : "text-accent")} size={14} />
                      Add Task
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-200",
                        active ? "bg-white/[0.08] text-white" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      <MousePointer2 size={14} />
                      Bulk Select
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "p-2.5 space-y-2.5 transition-all duration-200 min-h-[200px] rounded-lg mx-1",
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

    </div>
  );
};

export default KanbanColumn;
