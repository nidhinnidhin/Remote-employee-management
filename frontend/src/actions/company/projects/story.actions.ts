"use server";

import { StoryService } from "@/services/company/projects/story.service";
import { ProjectService } from "@/services/company/projects/project.service";
import { CreateStoryPayload, UpdateStoryPayload } from "@/shared/types/company/projects/user-story.type";
import { getServerApi } from "@/lib/axios/axiosServer";

export const uploadResourceAction = async (formData: FormData) => {
  try {
    const api = await getServerApi();
    const data = await ProjectService.uploadResource(formData, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const message = err.response?.data?.message || err.message || "Failed to upload resource";
    console.error("Error uploading resource:", message);
    return { success: false, error: message };
  }
};

export const getStoriesByProjectAction = async (projectId: string) => {
  try {
    const api = await getServerApi();
    const data = await StoryService.getStoriesByProject(projectId, api);
    console.log('------------------------',data)
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const message = err.response?.data?.message || err.message || "Failed to fetch stories";
    console.error("Error fetching stories:", message);
    return { success: false, error: message };
  }
};

export const createStoryAction = async (payload: CreateStoryPayload) => {
  try {
    const api = await getServerApi();
    const data = await StoryService.createStory(payload, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const message = err.response?.data?.message || err.message || "Failed to create story";
    console.error("Error creating story:", message);
    return { success: false, error: message };
  }
};

export const updateStoryAction = async (id: string, payload: UpdateStoryPayload) => {
  try {
    const api = await getServerApi();
    const data = await StoryService.updateStory(id, payload, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const message = err.response?.data?.message || err.message || "Failed to update story";
    console.error("Error updating story:", message);
    return { success: false, error: message };
  }
};

export const deleteStoryAction = async (id: string) => {
  try {
    const api = await getServerApi();
    await StoryService.deleteStory(id, api);
    return { success: true };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const message = err.response?.data?.message || err.message || "Failed to delete story";
    console.error("Error deleting story:", message);
    return { success: false, error: message };
  }
};

export const searchStoriesAction = async (params: {
  projectId?: string;
  status?: string;
  priority?: string;
  search?: string;
  isInBacklog?: boolean;
  page?: number;
  limit?: number;
}) => {
  try {
    const api = await getServerApi();
    const data = await StoryService.searchStories(params, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const message = err.response?.data?.message || err.message || "Failed to search stories";
    console.error("Error searching stories:", message);
    return { success: false, error: message };
  }
};
