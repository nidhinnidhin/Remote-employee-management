"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Loader2,
  Target,
  Hash,
  Timer,
  Edit3,
  Trash2,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import Button from "@/components/ui/Button";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { Sprint } from "@/shared/types/company/projects/sprint.type";
import { getStoriesByProjectAction } from "@/actions/company/projects/story.actions";
import { getSprintsByProjectAction, updateSprintAction } from "@/actions/company/projects/sprint.actions";
import { getEmployees } from "@/services/company/employee-management.service";
import { toast } from "sonner";
import StoryCard from "./StoryCard";
import SprintBurndown from "./SprintBurndown";
import { getTasksByProjectAction } from "@/actions/company/projects/task.actions";
import { Task } from "@/shared/types/company/projects/task.type";
import CreateStoryModal from "./modals/CreateStoryModal";
import EditStoryModal from "./modals/EditStoryModal";
import DeleteStoryConfirmation from "./modals/DeleteStoryConfirmation";
import CreateSprintModal from "./modals/CreateSprintModal";
import EditSprintModal from "./modals/EditSprintModal";
import DeleteSprintConfirmationModal from "./modals/DeleteSprintConfirmationModal";
import DeleteSprintOptionsModal from "./modals/DeleteSprintOptionsModal";
import { cn } from "@/lib/utils";

interface BacklogViewProps {
  projectId: string;
  projectMembers?: string[];
}

const BacklogView: React.FC<BacklogViewProps> = ({ projectId, projectMembers = [] }) => {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // New state for Sprints
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [selectedStoryForEdit, setSelectedStoryForEdit] =
    useState<UserStory | null>(null);
  const [selectedStoryForDelete, setSelectedStoryForDelete] =
    useState<UserStory | null>(null);

  const [sprintToEdit, setSprintToEdit] = useState<Sprint | null>(null);
  const [sprintToDelete, setSprintToDelete] = useState<Sprint | null>(null);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [storiesResult, sprintsResult, tasksResult, employeesData] = await Promise.all([
        getStoriesByProjectAction(projectId),
        getSprintsByProjectAction(projectId),
        getTasksByProjectAction(projectId),
        getEmployees(),
      ]);

      if (storiesResult.success && storiesResult.data) {
        setStories(storiesResult.data);
      } else {
        toast.error(storiesResult.error || "Failed to load stories");
      }

      if (sprintsResult.success && sprintsResult.data) {
        setSprints(sprintsResult.data);
      } else {
        toast.error(sprintsResult.error || "Failed to load sprints");
      }

      if (tasksResult.success && tasksResult.data) {
        setTasks(tasksResult.data);
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
    } catch (error) {
      toast.error("An unexpected error occurred while loading data");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // If dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle Moving from Backlog to Sprint
    if (source.droppableId === "backlog" && destination.droppableId.startsWith("sprint-")) {
      const sprintId = destination.droppableId.replace("sprint-", "");
      const storyId = draggableId;

      const targetSprint = sprints.find(s => s.id === sprintId);
      if (!targetSprint) return;

      // Prevent duplicates
      if (targetSprint.issueIds.includes(storyId)) {
        toast.info("This story is already in the sprint");
        return;
      }

      const updatedIssueIds = [...targetSprint.issueIds, storyId];

      // Optimistic Update
      setSprints(prev => prev.map(s => s.id === sprintId ? { ...s, issueIds: updatedIssueIds } : s));
      setStories(prev => prev.map(s => s.id === storyId ? { ...s, isInBacklog: false } : s));

      try {
        const result = await updateSprintAction(sprintId, { issueIds: updatedIssueIds });
        if (result.success) {
          toast.success(`Story assigned to ${targetSprint.name}`);
        } else {
          toast.error(result.error || "Failed to assign story to sprint");
          fetchData(); // Rollback
        }
      } catch (error) {
        toast.error("An error occurred while updating sprint");
        fetchData(); // Rollback
      }
    }
  };

  const filteredStories = stories
    .filter(
      (story) =>
        story.isInBacklog && (
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.description?.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => a.order - b.order);

  // --- RENDER SPRINTS SECTION ---
  const renderSprints = () => {
    if (loading && sprints.length === 0) {
      return (
        <div className="flex items-center justify-center py-12 animate-pulse bg-white/[0.01] rounded-2xl border border-white/[0.03]">
          <p className="text-slate-500 font-black tracking-[0.2em] text-[10px] uppercase">Loading Sprints...</p>
        </div>
      );
    }

    if (sprints.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white/[0.01] rounded-2xl border border-dashed border-white/[0.05]">
          <p className="text-slate-400 text-xs font-medium mb-4">No active or planned sprints.</p>
        </div>
      );
    }

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

    return (
      <div>
        {sprints.filter(s => s.status !== 'ACTIVE' && s.status !== 'COMPLETED').map((sprint) => (
          <Droppable key={sprint.id} droppableId={`sprint-${sprint.id}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "group relative p-5 border transition-all duration-300",
                  snapshot.isDraggingOver
                    ? "bg-orange-500/10 border-orange-500/50 scale-[1.02] shadow-2xl shadow-orange-500/10"
                    : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1]"
                )}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2.5 rounded-xl border transition-all duration-500",
                        snapshot.isDraggingOver ? "bg-orange-500 text-[#08090a] border-orange-500" : "bg-orange-500/10 border-orange-500/20 text-orange-500"
                      )}>
                        <Timer size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight">{sprint.name}</h3>
                        <div className="flex items-center gap-3">
                           <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
                             {sprint.issueIds.length} Objectives
                           </p>
                           <div className="w-1 h-1 rounded-full bg-slate-700" />
                           <p className="text-[10px] text-accent/60 font-bold uppercase tracking-tighter">
                             {stories.filter(s => sprint.issueIds.includes(s.id)).reduce((sum, s) => sum + (s.storyPoints || 0), 0)} Points
                           </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="flex items-center gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSprintToEdit(sprint)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                            title="Edit Sprint"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => setSprintToDelete(sprint)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                            title="Delete Sprint"
                          >
                            <Trash2 size={13} />
                          </button>
                       </div>
                       <span className={cn(
                         "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                         getStatusStyles(sprint.status)
                       )}>
                         {sprint.status}
                       </span>
                    </div>
                  </div>

                  {sprint.goal && (
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 italic opacity-80 mb-2">
                      "{sprint.goal}"
                    </p>
                  )}


                  {/* Stories List inside Sprint */}
                  <div className="space-y-2 mt-2">
                    {stories
                      .filter((story) => sprint.issueIds.includes(story.id))
                      .map((story) => (
                        <div key={story.id} className="opacity-80 hover:opacity-100 transition-opacity">
                          <StoryCard
                            story={story}
                            employees={employees}
                            onEdit={() => {}}
                            onDelete={() => {}}
                          />
                        </div>
                      ))}
                    {sprint.issueIds.length === 0 && (
                      <div className="py-4 border border-dashed border-white/5 rounded-xl flex items-center justify-center">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                          Drop stories here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    );
  };

  // --- RENDER BACKLOG SECTION ---
  const renderBacklog = () => {
    if (loading && stories.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-6 animate-in fade-in duration-1000">
          <div className="relative">
            <Loader2 className="animate-spin text-accent/40" size={40} strokeWidth={1} />
            <div className="absolute inset-0 blur-2xl bg-accent/10 animate-pulse" />
          </div>
          <p className="text-slate-500 font-black tracking-[0.3em] text-[9px] uppercase">
            Decrypting Backlog Registry
          </p>
        </div>
      );
    }

    if (stories.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/[0.05]">
          <div className="w-20 h-20 rounded-[2.5rem] bg-accent/5 flex items-center justify-center text-accent/20 border border-accent/10 mb-8 group transition-all">
            <Target size={32} className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
          </div>
          <h3 className="text-xl font-black text-white mb-3 tracking-tighter">
            No Operational Objectives
          </h3>
          <p className="text-slate-500 text-sm max-w-[300px] leading-relaxed mb-10 font-medium">
            This project node is currently empty. Initialize your first user story to begin.
          </p>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="h-12 px-10 rounded-xl bg-accent text-[#08090a] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-accent/10"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Initialize Story</span>
          </Button>
        </div>
      );
    }

    return (
      <Droppable droppableId="backlog">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex flex-col gap-4 animate-in fade-in duration-500 min-h-[200px] rounded-3xl transition-colors",
              snapshot.isDraggingOver ? "bg-accent/[0.02]" : ""
            )}
          >
            <div className="grid grid-cols-1 gap-3">
              {filteredStories.map((story, index) => (
                <Draggable key={story.id} draggableId={story.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1,
                      }}
                      className={cn(
                        "transition-shadow",
                        snapshot.isDragging ? "shadow-2xl shadow-accent/20 z-50" : ""
                      )}
                    >
                      <StoryCard
                        story={story}
                        employees={employees}
                        onEdit={setSelectedStoryForEdit}
                        onDelete={setSelectedStoryForDelete}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>

            {filteredStories.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-white/[0.01] rounded-3xl border border-white/[0.03]">
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">
                  No Matches for "{searchQuery}"
                </p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-8">
        {/* ─── GLOBAL SEARCH & ACTION BAR ─── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-white/[0.05] mb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-1">
              <h2 className="text-sm font-black text-white tracking-tight uppercase">
                Planning Board
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tactical Search */}
            <div className="relative group flex-1 sm:w-72">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors"
              />
              <input
                type="text"
                placeholder="Search registry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl pl-11 pr-4 h-11 text-[13px] text-white placeholder:text-slate-600 outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all"
              />
            </div>

            <div className="h-10 w-px bg-white/[0.06] hidden sm:block" />

            {/* Add Sprint Button */}
            <Button
              variant="primary"
              onClick={() => setIsSprintModalOpen(true)}
              className="h-11 px-6 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white hover:bg-white/[0.08] hover:border-orange-500/50 text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 group shadow-none"
            >
              <Timer
                size={16}
                strokeWidth={3}
                className="text-orange-500/70 group-hover:text-orange-400 transition-colors"
              />
              <span>Add Sprint</span>
            </Button>

            {/* Action Button (Add Story) */}
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="h-11 px-6 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white hover:bg-accent hover:text-[#08090a] hover:border-accent text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 group shadow-none"
            >
              <Plus
                size={16}
                strokeWidth={3}
                className="text-accent group-hover:text-current"
              />
              <span>Add Story</span>
            </Button>
          </div>
        </div>

        {/* ─── SPRINTS SECTION ─── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1 border-l-2 border-orange-500/50 pl-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[11px] font-black text-slate-300 tracking-widest uppercase">
                Sprints
              </h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.08]">
                <Hash size={10} className="text-slate-500" />
                <span className="text-[10px] font-bold text-orange-400 tracking-tighter">
                  {sprints.filter(s => s.status !== 'ACTIVE' && s.status !== 'COMPLETED').length}
                </span>
              </div>
            </div>

            {sprints.length > 0 && (
              <button
                onClick={() => setIsSprintModalOpen(true)}
                className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-orange-400 transition-colors"
              >
                + Create Sprint
              </button>
            )}
          </div>
          <div>{renderSprints()}</div>
        </div>

        {/* ─── DIVIDER ─── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent my-2" />

        {/* ─── BACKLOG SECTION ─── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5 px-1 border-l-2 border-accent/30 pl-4">
            <h2 className="text-[11px] font-black text-slate-300 tracking-widest uppercase">
              Backlog Registry
            </h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.08]">
              <Hash size={10} className="text-slate-500" />
              <span className="text-[10px] font-bold text-accent tracking-tighter">
                {stories.filter(s => s.isInBacklog).length}
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.08]">
              <Target size={10} className="text-slate-500" />
              <span className="text-[10px] font-bold text-orange-400 tracking-tighter">
                {stories.filter(s => s.isInBacklog).reduce((sum, s) => sum + (s.storyPoints || 0), 0)} Points
              </span>
            </div>
          </div>
          <div className="min-h-[300px]">{renderBacklog()}</div>
        </div>

        {/* Modals */}
        <CreateStoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchData}
          projectId={projectId}
          employees={employees}
        />

        <CreateSprintModal
          isOpen={isSprintModalOpen}
          onClose={() => setIsSprintModalOpen(false)}
          onSuccess={fetchData}
          projectId={projectId}
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
    </DragDropContext>
  );
};

export default BacklogView;