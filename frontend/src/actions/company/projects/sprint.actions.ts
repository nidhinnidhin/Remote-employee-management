"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import { SprintService } from "@/services/company/projects/sprint.service";
import { CreateSprintPayload, UpdateSprintPayload } from "@/shared/types/company/projects/sprint.type";

export const getSprintsByProjectAction = async (projectId: string) => {
  try {
    const api = await getServerApi();
    const data = await SprintService.getSprintsByProject(projectId, api);
    // Normalize _id to id for frontend consistency
    const normalized = data.map((s: any) => ({ ...s, id: s.id || s._id }));
    return { success: true, data: normalized };
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Failed to fetch sprints";
    console.error("Error fetching sprints:", message);
    return { success: false, error: message };
  }
};

export const createSprintAction = async (projectId: string, payload: CreateSprintPayload) => {
  try {
    const api = await getServerApi();
    const data = await SprintService.createSprint(projectId, payload, api);
    // Normalize _id to id
    const normalized = { ...data, id: (data as any).id || (data as any)._id };
    return { success: true, data: normalized };
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Failed to create sprint";
    console.error("Error creating sprint:", message);
    return { success: false, error: message };
  }
};

export const updateSprintAction = async (id: string, payload: UpdateSprintPayload) => {
  try {
    const api = await getServerApi();
    const data = await SprintService.updateSprint(id, payload, api);
    return { success: true, data };
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Failed to update sprint";
    console.error("Error updating sprint:", message);
    return { success: false, error: message };
  }
};

export const deleteSprintAction = async (id: string, hardDelete: boolean) => {
  try {
    const api = await getServerApi();
    // Using axios.delete with data payload
    await api.delete(`/sprints/${id}`, { data: { hardDeleteIssues: hardDelete } });
    return { success: true };
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Failed to delete sprint";
    console.error("Error deleting sprint:", message);
    return { success: false, error: message };
  }
};
