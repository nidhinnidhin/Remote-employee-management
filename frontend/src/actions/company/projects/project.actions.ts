"use server";

import { ProjectService } from "@/services/company/projects/project.service";
import { CreateProjectPayload, UpdateProjectPayload } from "@/shared/types/company/projects/project.type";
import { getServerApi } from "@/lib/axios/axiosServer";

export const getAllProjectsAction = async () => {
  try {
    const api = await getServerApi();
    const data = await ProjectService.getAllProjects(api);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching projects:", error?.message);
    return { success: false, error: error?.message || "Failed to fetch projects" };
  }
};

export const getProjectByIdAction = async (id: string) => {
  try {
    const api = await getServerApi();
    const data = await ProjectService.getProjectById(id, api);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching project:", error?.message);
    return { success: false, error: error?.message || "Failed to fetch project" };
  }
};

export const createProjectAction = async (payload: CreateProjectPayload) => {
  try {
    const api = await getServerApi();
    const data = await ProjectService.createProject(payload, api);
    return { success: true, data };
  } catch (error: any) {
    if (error.response?.status === 400) {
      const data = error.response.data;
      const messages = data.errors || data.message;
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
      return { success: false, error: messages || "Validation failed" };
    }

    console.error("Error creating project:", error?.message);
    return { success: false, error: error?.response?.data?.message || error?.message || "Failed to create project" };
  }
};

export const updateProjectAction = async (id: string, payload: UpdateProjectPayload) => {
  try {
    const api = await getServerApi();
    const data = await ProjectService.updateProject(id, payload, api);
    return { success: true, data };
  } catch (error: any) {
    if (error.response?.status === 400) {
      const data = error.response.data;
      const messages = data.errors || data.message;
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
      return { success: false, error: messages || "Validation failed" };
    }

    console.error("Error updating project:", error?.message);
    return { success: false, error: error?.response?.data?.message || error?.message || "Failed to update project" };
  }
};

export const deleteProjectAction = async (id: string) => {
  try {
    const api = await getServerApi();
    await ProjectService.deleteProject(id, api);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting project:", error?.message);
    return { success: false, error: error?.message || "Failed to delete project" };
  }
};
