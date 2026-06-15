"use server";

import { TaskService } from "@/services/company/projects/task.service";
import { ProjectService } from "@/services/company/projects/project.service";
import { CreateTaskPayload, UpdateTaskPayload, MoveTaskPayload, Task, MyTasksResponse } from "@/shared/types/company/projects/task.type";
import { getServerApi } from "@/lib/axios/axiosServer";

export const uploadResourceAction = async (formData: FormData) => {
  try {
    const api = await getServerApi();
    const data = await ProjectService.uploadResource(formData, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error uploading resource:", err?.message);
    return { success: false, error: err?.message || "Failed to upload resource" };
  }
};

export const getTasksByStoryAction = async (storyId: string) => {
  try {
    const api = await getServerApi();
    const data = await TaskService.getTasksByStory(storyId, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error: err.response?.data?.message || "Failed to fetch tasks",
    };
  }
};

export const getTasksByProjectAction = async (projectId: string) => {
  try {
    const api = await getServerApi();
    const data = await TaskService.getTasksByProject(projectId, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error: err.response?.data?.message || "Failed to fetch tasks",
    };
  }
};

export const getTaskByIdAction = async (id: string) => {
  try {
    const api = await getServerApi();
    const data = await TaskService.getTaskById(id, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error: err.response?.data?.message || "Failed to fetch task",
    };
  }
};

export const createTaskAction = async (payload: CreateTaskPayload) => {
  try {
    const api = await getServerApi();
    const data = await TaskService.createTask(payload, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error: err.response?.data?.message || "Failed to create task",
    };
  }
};

export const updateTaskAction = async (id: string, payload: UpdateTaskPayload) => {
  try {
    const api = await getServerApi();
    const data = await TaskService.updateTask(id, payload, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error: err.response?.data?.message || "Failed to update task",
    };
  }
};

export const moveTaskAction = async (id: string, payload: MoveTaskPayload) => {
  try {
    const api = await getServerApi();
    const data = await TaskService.moveTask(id, payload, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error: err.response?.data?.message || "Failed to move task",
    };
  }
};

export const deleteTaskAction = async (id: string) => {
  try {
    const api = await getServerApi();
    await TaskService.deleteTask(id, api);
    return { success: true };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error: err.response?.data?.message || "Failed to delete task",
    };
  }
};

export const fetchMyTasksAction = async () => {
  try {
    const api = await getServerApi();
    const data = await TaskService.getMyTasks(api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error: err.response?.data?.message || "Failed to fetch your tasks",
    };
  }
};
export const searchTasksAction = async (params: {
  projectId?: string;
  storyId?: string;
  memberId?: string;
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const api = await getServerApi();
    const data = await TaskService.searchTasks(params, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error: err.response?.data?.message || "Failed to search tasks",
    };
  }
};
