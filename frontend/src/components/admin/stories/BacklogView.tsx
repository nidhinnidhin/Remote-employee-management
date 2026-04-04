"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, ListTodo, Search, Filter, Loader2, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { getStoriesByProjectAction } from "@/actions/company/projects/story.actions";
import { getEmployees } from "@/services/company/employee-management.service";
import { toast } from "sonner";
import StoryCard from "./StoryCard";
import CreateStoryModal from "./modals/CreateStoryModal";
import EditStoryModal from "./modals/EditStoryModal";
import DeleteStoryConfirmation from "./modals/DeleteStoryConfirmation";
import { cn } from "@/lib/utils";

interface BacklogViewProps {
  projectId: string;
}

const BacklogView: React.FC<BacklogViewProps> = ({ projectId }) => {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStoryForEdit, setSelectedStoryForEdit] = useState<UserStory | null>(null);
  const [selectedStoryForDelete, setSelectedStoryForDelete] = useState<UserStory | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [storiesResult, employeesData] = await Promise.all([
        getStoriesByProjectAction(projectId),
        getEmployees(),
      ]);

      if (storiesResult.success && storiesResult.data) {
        setStories(storiesResult.data);
      } else {
        toast.error(storiesResult.error || "Failed to load stories");
      }

      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching backlog data:", error);
      toast.error("An unexpected error occurred while loading data");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.order - b.order);

  const renderContent = () => {
    if (loading && stories.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-700">
          <div className="relative">
            <Loader2 className="animate-spin text-accent" size={48} strokeWidth={1.5} />
            <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse" />
          </div>
          <p className="text-muted font-bold tracking-widest text-[10px] uppercase">Synchronizing Backlog...</p>
        </div>
      );
    }

    if (stories.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 rounded-[2.5rem] bg-accent/5 flex items-center justify-center text-accent/20 border border-accent/10 mb-6 group hover:scale-110 transition-transform duration-500">
            <ListTodo size={40} className="group-hover:rotate-12 transition-transform duration-500" />
          </div>
          <h3 className="text-xl font-black text-primary mb-2 tracking-tight">Your Backlog is Clean</h3>
          <p className="text-muted text-sm max-w-[280px] leading-relaxed mb-8 font-medium">
            No user stories found for this project. Start by defining your first requirement.
          </p>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="shadow-xl shadow-accent/20 px-8 py-3"
          >
            <Plus size={18} />
            <span>Add First Story</span>
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 animate-in fade-in duration-500">
        {filteredStories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            employees={employees}
            onEdit={setSelectedStoryForEdit}
            onDelete={setSelectedStoryForDelete}
          />
        ))}
        {filteredStories.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-border-subtle/30 rounded-3xl">
            <p className="text-muted text-sm font-medium">No results matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent">
            <ListTodo size={18} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-primary tracking-tight">User Stories</h2>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">
              {stories.length} {stories.length === 1 ? 'Requirement' : 'Requirements'} Total
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="field-input !pl-9 h-10 py-0 bg-surface-raised/30 border-border-subtle/40 focus:bg-surface focus:border-accent"
            />
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="h-10 px-4 text-xs font-black uppercase tracking-widest gap-2 bg-gradient-to-r from-accent to-accent-muted shadow-lg shadow-accent/20"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Story</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {renderContent()}

      {/* Modals */}
      <CreateStoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchData}
        projectId={projectId}
        employees={employees}
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

export default BacklogView;
