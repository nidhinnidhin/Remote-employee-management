"use server";

import { StoryService } from "@/services/company/projects/story.service";
import { CreateStoryPayload, UpdateStoryPayload } from "@/shared/types/company/projects/user-story.type";
import { getServerApi } from "@/lib/axios/axiosServer";

export const getStoriesByProjectAction = async (projectId: string) => {
  try {
    const api = await getServerApi();
    const data = await StoryService.getStoriesByProject(projectId, api);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching stories:", error?.message);
    return { success: false, error: error?.message || "Failed to fetch stories" };
  }
};

export const createStoryAction = async (payload: CreateStoryPayload) => {
  try {
    const api = await getServerApi();
    const data = await StoryService.createStory(payload, api);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating story:", error?.message);
    return { success: false, error: error?.message || "Failed to create story" };
  }
};

export const updateStoryAction = async (id: string, payload: UpdateStoryPayload) => {
  try {
    const api = await getServerApi();
    const data = await StoryService.updateStory(id, payload, api);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating story:", error?.message);
    return { success: false, error: error?.message || "Failed to update story" };
  }
};

export const deleteStoryAction = async (id: string) => {
  try {
    const api = await getServerApi();
    await StoryService.deleteStory(id, api);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting story:", error?.message);
    return { success: false, error: error?.message || "Failed to delete story" };
  }
};
