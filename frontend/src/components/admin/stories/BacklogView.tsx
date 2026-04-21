"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  ListTodo,
  Search,
  Loader2,
  Target,
  Hash,
  Filter,
  ArrowUpDown,
} from "lucide-react";
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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStoryForEdit, setSelectedStoryForEdit] =
    useState<UserStory | null>(null);
  const [selectedStoryForDelete, setSelectedStoryForDelete] =
    useState<UserStory | null>(null);

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
      toast.error("An unexpected error occurred while loading data");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredStories = stories
    .filter(
      (story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => a.order - b.order);

  const renderContent = () => {
    if (loading && stories.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-6 animate-in fade-in duration-1000">
          <div className="relative">
            <Loader2
              className="animate-spin text-accent/40"
              size={40}
              strokeWidth={1}
            />
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
            <Target
              size={32}
              className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
            />
          </div>
          <h3 className="text-xl font-black text-white mb-3 tracking-tighter">
            No Operational Objectives
          </h3>
          <p className="text-slate-500 text-sm max-w-[300px] leading-relaxed mb-10 font-medium">
            This project node is currently empty. Initialize your first user
            story to begin the sprint.
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
      <div className="flex flex-col gap-4 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 gap-3">
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              employees={employees}
              onEdit={setSelectedStoryForEdit}
              onDelete={setSelectedStoryForDelete}
            />
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white/[0.01] rounded-3xl border border-white/[0.03]">
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">
              No Matches for "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ─── SEARCH & FILTER BAR ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-1 border-l-2 border-accent/30 pl-4">
            <h2 className="text-sm font-black text-white tracking-tight uppercase">
              Backlog
            </h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.08]">
              <Hash size={10} className="text-slate-500" />
              <span className="text-[10px] font-bold text-accent tracking-tighter">
                {stories.length}
              </span>
            </div>
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

          {/* Action Button */}
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

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="min-h-[400px]">{renderContent()}</div>

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
