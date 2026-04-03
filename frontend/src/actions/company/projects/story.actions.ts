import { StoryService } from "@/services/company/projects/story.service";
import { CreateStoryPayload, UpdateStoryPayload } from "@/shared/types/company/projects/user-story.type";

export const getStoriesByProjectAction = async (projectId: string) => {
  try {
    const data = await StoryService.getStoriesByProject(projectId);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching stories:", error?.message);
    return { success: false, error: error?.message || "Failed to fetch stories" };
  }
};

export const createStoryAction = async (payload: CreateStoryPayload) => {
  try {
    const data = await StoryService.createStory(payload);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating story:", error?.message);
    return { success: false, error: error?.message || "Failed to create story" };
  }
};

export const updateStoryAction = async (id: string, payload: UpdateStoryPayload) => {
  try {
    const data = await StoryService.updateStory(id, payload);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating story:", error?.message);
    return { success: false, error: error?.message || "Failed to update story" };
  }
};

export const deleteStoryAction = async (id: string) => {
  try {
    await StoryService.deleteStory(id);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting story:", error?.message);
    return { success: false, error: error?.message || "Failed to delete story" };
  }
};
