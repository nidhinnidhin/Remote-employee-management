"use server";

import { ProjectService } from "@/services/company/projects/project.service";
import { CreateProjectPayload, UpdateProjectPayload } from "@/shared/types/company/projects/project.type";
import { getServerApi } from "@/lib/axios/axiosServer";

export const getAllProjectsAction = async () => {
  try {
    const api = await getServerApi();
    const data = await ProjectService.getAllProjects(api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error fetching projects:", err?.message);
    return { success: false, error: err?.message || "Failed to fetch projects" };
  }
};

export const getProjectByIdAction = async (id: string) => {
  try {
    const api = await getServerApi();
    const data = await ProjectService.getProjectById(id, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error fetching project:", err?.message);
    return { success: false, error: err?.message || "Failed to fetch project" };
  }
};

export const createProjectAction = async (payload: CreateProjectPayload) => {
  try {
    const api = await getServerApi();
    const data = await ProjectService.createProject(payload, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: { message?: string | string[]; errors?: Record<string, string> } }; message?: string };
    if (err.response?.status === 400) {
      const data = err.response.data;
      const messages = data?.errors || data?.message;
      const errors: Record<string, string> = {};

      if (Array.isArray(messages)) {
        messages.forEach((msg: string) => {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes("name")) errors.name = msg;
          else if (lowerMsg.includes("description")) errors.description = msg;
          else if (lowerMsg.includes("start") || lowerMsg.includes("startdate")) errors.startDate = msg;
          else if (lowerMsg.includes("end") || lowerMsg.includes("enddate")) errors.endDate = msg;
          else if (lowerMsg.includes("status")) errors.status = msg;
        });

        if (Object.keys(errors).length > 0) {
          return { success: false, errors };
        }

        return { success: false, error: messages[0] || "Validation failed" };
      }

      // Fallback for single message strings
      return { success: false, error: (typeof messages === 'string' ? messages : "Validation failed") };
    }

    console.error("Error creating project:", err?.message);
    return { success: false, error: err?.response?.data?.message || err?.message || "Failed to create project" };
  }
};

export const updateProjectAction = async (id: string, payload: UpdateProjectPayload) => {
  try {
    const api = await getServerApi();
    const data = await ProjectService.updateProject(id, payload, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: { message?: string | string[]; errors?: Record<string, string> } }; message?: string };
    if (err.response?.status === 400) {
      const data = err.response.data;
      const messages = data?.errors || data?.message;
      const errors: Record<string, string> = {};

      if (Array.isArray(messages)) {
        messages.forEach((msg: string) => {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes("name")) errors.name = msg;
          else if (lowerMsg.includes("description")) errors.description = msg;
          else if (lowerMsg.includes("start") || lowerMsg.includes("startdate")) errors.startDate = msg;
          else if (lowerMsg.includes("end") || lowerMsg.includes("enddate")) errors.endDate = msg;
          else if (lowerMsg.includes("status")) errors.status = msg;
        });

        if (Object.keys(errors).length > 0) {
          return { success: false, errors };
        }
        return { success: false, error: messages[0] || "Validation failed" };
      }
      return { success: false, error: (typeof messages === 'string' ? messages : "Validation failed") };
    }

    console.error("Error updating project:", err?.message);
    return { success: false, error: err?.response?.data?.message || err?.message || "Failed to update project" };
  }
};

export const deleteProjectAction = async (id: string) => {
  try {
    const api = await getServerApi();
    await ProjectService.deleteProject(id, api);
    return { success: true };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error deleting project:", err?.message);
    return { success: false, error: err?.message || "Failed to delete project" };
  }
};

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

export const searchProjectsAction = async (params: { page: number; limit: number; search?: string; memberId?: string }) => {
  try {
    const api = await getServerApi();
    const data = await ProjectService.searchProjects(params, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error searching projects:", err?.message);
    return { success: false, error: err?.message || "Failed to search projects" };
  }
};
